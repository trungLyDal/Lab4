const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

const RESTRICTION_CONFLICTS = {
    'Vegetarian': [
        'chicken', 'beef', 'pork', 'lamb', 'turkey', 'veal', 'venison', 'goat',
        'meat', 'sausage', 'bacon', 'ham', 'cured', 'mince', 'prosciutto', 'salami', 
        'pepperoni', 'jerky', 'gammon', 'tallow', 'lard', 'animal',
        'fish', 'seafood', 'shrimp', 'prawn', 'crab', 'lobster', 
        'salmon', 'tuna', 'cod', 'sardines', 'mackerel', 'oyster', 'squid', 'mussel'
    ],
    
    'Vegan': [
        'chicken', 'beef', 'pork', 'lamb', 'turkey', 'veal', 'venison', 'goat',
        'meat', 'sausage', 'bacon', 'ham', 'cured', 'mince', 'prosciutto', 'salami', 
        'pepperoni', 'jerky', 'gammon', 'tallow', 'lard', 'animal',
        'fish', 'seafood', 'shrimp', 'crab', 'salmon', 'tuna', 'cod', 'oyster', 
        'milk', 'eggs', 'cheese', 'honey', 'cream', 'butter', 
        'mayonnaise', 'yogurt', 'gelatin', 'whey', 'casein'
    ],
    
    'Gluten-Free': [
        'wheat', 'barley', 'rye', 'pasta', 'bread', 'flour', 
        'malt', 'oats', 'soy sauce', 'semolina', 'couscous', 'spelt'
    ], 
    
    'Keto': [
        'rice', 'bread', 'pasta', 'sugar', 'potato', 'honey', 
        'banana', 'corn', 'quinoa', 'oats', 'maple syrup', 'carrots', 
        'beans', 'yams', 'agave'
    ] 
};


const VEGETARIAN_WHITELIST = [
    'tofu', 'tempeh', 'seitan', 'lentil', 'bean', 'chickpea', 'hummus', 'mushroom', 'veg', 
    'vegetable', 'salad', 'soup', 'stew', 'curry', 'casserole', 'pie', 'bake', 'burger', 
    'roll', 'wrap', 'noodle', 'pasta', 'rice', 'sandwich', 'omelette', 'frittata', 
    'taco', 'burrito', 'pizza', 'quiche', 'galette', 'gratin', 'tagine', 'risotto', 
    'cheese', 'egg', 'dairy', 'milk', 'cream', 'butter', 'yogurt'
];

const VEGAN_WHITELIST = [
    'tofu', 'tempeh', 'seitan', 'lentil', 'bean', 'chickpea', 'hummus', 'mushroom', 'veg', 
    'vegetable', 'salad', 'soup', 'stew', 'curry', 'casserole', 'pie', 'bake', 'burger',

];

async function setupApp() {

    app.use(cors()); 
    app.use(express.json());


app.get('/api/recipes', async (req, res) => {
    const { ingredient, restriction } = req.query;

    if (!ingredient) {
        return res.status(400).json({ error: 'Missing required query parameter: ingredient' });
    }

    const normalizedIngredient = ingredient.toLowerCase();
    
    if (restriction && restriction !== 'No Restriction' && RESTRICTION_CONFLICTS[restriction]) {
        const conflictingIngredients = RESTRICTION_CONFLICTS[restriction];
        
        if (conflictingIngredients.some(c => normalizedIngredient.includes(c))) {
            return res.json({ recipes: [] });
        }
    }
    
    try {
        const mealDbResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`);
        
        if (!mealDbResponse.ok) {
            return res.status(500).json({ error: 'Failed to retrieve recipes from external API.' }); 
        }
        
        const data = await mealDbResponse.json();
        let fetchedRecipes = data.meals || [];

        if (restriction && restriction !== 'No Restriction' && RESTRICTION_CONFLICTS[restriction]) {
            const conflictingWords = RESTRICTION_CONFLICTS[restriction];
            
            fetchedRecipes = fetchedRecipes.filter(recipe => {
                const mealName = recipe.strMeal.toLowerCase();
                return !conflictingWords.some(word => mealName.includes(word));
            });

            if (restriction === 'Vegetarian' || restriction === 'Vegan') {
                const requiredWords = (restriction === 'Vegan') ? VEGAN_WHITELIST : VEGETARIAN_WHITELIST;

                fetchedRecipes = fetchedRecipes.filter(recipe => {
                    const mealName = recipe.strMeal.toLowerCase();
                    
                    const containsSearchIngredient = mealName.includes(normalizedIngredient);
                    const containsSafetyWord = requiredWords.some(word => mealName.includes(word));
                    
                    return containsSearchIngredient || containsSafetyWord;
                });
            }
        }
        
        res.json({ recipes: fetchedRecipes });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Failed to retrieve recipes from external API.' });
    }
});

    return app;
}

if (require.main === module) {
    setupApp().then(app => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log('Test endpoint: http://localhost:3000/api/recipes?ingredient=chicken');
        });
    });
}

module.exports = setupApp;