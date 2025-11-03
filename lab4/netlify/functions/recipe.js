import fetch from 'node-fetch'; 

const MEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=';

export const handler = async (event, context) => {
    const ingredient = event.queryStringParameters.ingredient;

    if (!ingredient) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing required query parameter: ingredient' }),
        };
    }

    try {
        const apiURL = `${MEALDB_BASE_URL}${ingredient}`;
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error(`TheMealDB API failed with status: ${response.status}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify({
                recipes: data.meals || []
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        };

    } catch (error) {
        console.error('Error fetching recipes:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve recipes from external API.' }),
        };
    }
};