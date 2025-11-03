const API_BASE_URL = '';

function displayFeedback(message, isError = false) {
    const feedbackMessage = document.getElementById('feedback-message');

    if (!feedbackMessage) return; 

    feedbackMessage.textContent = message;
    feedbackMessage.className = isError ? 'error-message' : 'info-message';
}

function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes-container');
    const ingredientInput = document.getElementById('ingredient-input');

    if (!recipesContainer || !ingredientInput) return;

    recipesContainer.innerHTML = ''; 

    if (!recipes || recipes.length === 0) {
        displayFeedback(`No recipes found for "${ingredientInput.value}". Please try another ingredient.`, true);
        return;
    }

    displayFeedback(`Found ${recipes.length} recipes for "${ingredientInput.value}".`, false);

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            
            <a href="https://www.themealdb.com/meal/${recipe.idMeal}" target="_blank">
<img src="${recipe.strMealThumb}" alt='Photo of ${recipe.strMeal}' loading="lazy"></a>
                        <h3>${recipe.strMeal}</h3>

            `;
        recipesContainer.appendChild(recipeCard);
    });
}

async function fetchRecipes(ingredient, restriction) {
    if (ingredient.trim() === '') {
        displayFeedback('Please enter an ingredient before searching.', true);
        return;
    }

    const queryParams = new URLSearchParams({
        ingredient: ingredient,
        ...(restriction && { restriction: restriction }) 
    });
    
    displayFeedback(`Searching for ${restriction ? restriction : 'any'} recipes with "${ingredient}"...`, false);
    
    const recipesContainer = document.getElementById('recipes-container');
    if (recipesContainer) recipesContainer.innerHTML = ''; 

    try {
        const response = await fetch(`/.netlify/functions/recipes?${queryParams.toString()}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        displayRecipes(data.recipes);

    } catch (error) {
        console.error('Fetch error:', error);
        displayFeedback(`Search failed: ${error.message}. Please check the server and try again.`, true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recipe-search-form');
    const ingredientInput = document.getElementById('ingredient-input');
    const restrictionInput = document.getElementById('diet-restriction');

    if (form && ingredientInput && restrictionInput) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const ingredient = ingredientInput.value.trim();
            const restriction = restrictionInput.value; 
            
            fetchRecipes(ingredient, restriction); 
        });
    }
});



if (typeof window !== 'undefined') {
    window.displayFeedback = displayFeedback;
    window.displayRecipes = displayRecipes;
    window.fetchRecipes = fetchRecipes;
}