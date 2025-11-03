const mockHtml = `
    <div id="recipes-container"></div>
    <p id="feedback-message" aria-live="polite"></p>
    <input type="text" id="ingredient-input" value="chicken"> 
    <form id="recipe-search-form"></form>
`;

describe('Client-Side UI Functions', () => {
    
    let displayFeedback;
    let displayRecipes;
    let feedbackMessage;
    let recipesContainer;

    beforeEach(() => {
        document.body.innerHTML = mockHtml;
        
        require('../script'); 
        
        displayFeedback = window.displayFeedback;
        displayRecipes = window.displayRecipes;
        feedbackMessage = document.getElementById('feedback-message');
        recipesContainer = document.getElementById('recipes-container');
    });


    describe('displayFeedback(message, isError)', () => {
        
        test('1. Should display a success message with the correct class', () => {
            const message = 'Search completed successfully.';
            
            displayFeedback(message, false);

            expect(feedbackMessage.textContent).toBe(message);
            expect(feedbackMessage.className).toBe('info-message'); 
            expect(feedbackMessage.classList.contains('error-message')).toBe(false); 
        });

        test('2. Should display an error message with the correct class', () => {
            const message = 'The server failed to respond.';
            
            displayFeedback(message, true);

            expect(feedbackMessage.textContent).toBe(message);
            expect(feedbackMessage.className).toBe('error-message');
        });
    });

    describe('displayRecipes(recipes)', () => {
        const mockRecipes = [
            { idMeal: "52771", strMeal: "Soup", strMealThumb: "soup.jpg" },
            { idMeal: "52855", strMeal: "Salad", strMealThumb: "salad.jpg" }
        ];

        test('3. Should correctly render a list of recipes', () => {
            displayRecipes(mockRecipes);

            expect(recipesContainer.children.length).toBe(mockRecipes.length);
            
            const firstRecipeCard = recipesContainer.children[0].innerHTML;
            expect(firstRecipeCard).toContain('<h3>Soup</h3>');
            expect(firstRecipeCard).toContain('src="soup.jpg"');
            expect(feedbackMessage.textContent).toContain('Found 2 recipes for "chicken".');
        });

        test('4. Should display a "No recipes found" message if the array is empty', () => {
            displayRecipes([]);

            expect(recipesContainer.innerHTML).toBe('');
            
            expect(feedbackMessage.textContent).toContain('No recipes found for "chicken".');
        });

        test('5. Should display a "No recipes found" message if recipes is null', () => {
            displayRecipes(null);
            expect(recipesContainer.innerHTML).toBe('');
            expect(feedbackMessage.textContent).toContain('No recipes found for "chicken".');
        });
    });
});