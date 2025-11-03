const request = require('supertest');
const setupApp = require('../server'); 

const mockRecipeData = {
    meals: [
        { idMeal: "52771", strMeal: "Spicy Coconut Chicken", strMealThumb: "..." },
        { idMeal: "52855", strMeal: "Chicken Fajita Mac and Cheese", strMealThumb: "..." }
    ]
};

let app;


beforeAll(async () => {
    app = await setupApp();
});

beforeEach(() => {
    fetch.resetMocks(); 
});


describe('GET /api/recipes', () => {

    test('1. Should successfully fetch recipes and return 200', async () => {
        fetch.mockResponseOnce(JSON.stringify(mockRecipeData));

        const response = await request(app)
            .get('/api/recipes?ingredient=chicken')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.recipes).toEqual(mockRecipeData.meals);
        expect(fetch).toHaveBeenCalledTimes(1); 
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('chicken'));
    });

    test('2. Should return an empty array if no recipes are found', async () => {
        fetch.mockResponseOnce(JSON.stringify({ meals: null })); 

        const response = await request(app)
            .get('/api/recipes?ingredient=zzz') 
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.recipes).toEqual([]);
    });

    test('3. Should return 400 if the ingredient query parameter is missing', async () => {

        const response = await request(app)
            .get('/api/recipes')
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body.error).toBe('Missing required query parameter: ingredient');
    });

    test('4. Should return 500 if the external API request fails (Network/DNS error)', async () => {
  
        fetch.mockReject(new Error('Network connection failed')); 

        const response = await request(app)
            .get('/api/recipes?ingredient=error_test')
            .expect('Content-Type', /json/)
            .expect(500);

        expect(response.body.error).toBe('Failed to retrieve recipes from external API.');
    });
    
    test('5. Should return 500 if the external API returns a non-200 status (e.g., 403)', async () => {
  
        fetch.mockResponseOnce('{"message": "Forbidden"}', { status: 403, statusText: 'Forbidden' }); 

        const response = await request(app)
            .get('/api/recipes?ingredient=forbidden_test')
            .expect('Content-Type', /json/)
            .expect(500); 

        expect(response.body.error).toBe('Failed to retrieve recipes from external API.');
    });
});