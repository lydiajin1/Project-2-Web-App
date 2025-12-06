const helper = require('./helper.js');
const React = require('react');
const RecipeFormFields = require('./RecipeFormFields.jsx');

// Helper function to validate recipe form fields
// Reduces code duplication 
const validateRecipeFields = (recipeData) => {
    const { title, ingredients, instructions, cookTime, difficulty } = recipeData;
    if (!title || !ingredients || !instructions || !cookTime || !difficulty) {
        helper.handleError('All fields are required');
        return false;
    }
    return true;
};

// Handles form submission for adding a new recipe
const handleRecipe = (e, onRecipeAdded) => {
    e.preventDefault();
    helper.hideError();

    const recipeData = {
        title: e.target.querySelector('#recipeTitle').value,
        ingredients: e.target.querySelector("#recipeIngredients").value,
        instructions: e.target.querySelector("#recipeInstructions").value,
        cookTime: e.target.querySelector("#recipeCookTime").value,
        difficulty: e.target.querySelector("#recipeDifficulty").value,
    };

    if (!validateRecipeFields(recipeData)) {
        return false;
    }

    helper.sendPost('/recipes', recipeData, onRecipeAdded);
    return false;
}

// Component for the recipe submission form
const RecipeForm = (props) => {
    return (
        <form id="recipeForm"
            onSubmit={(e) => handleRecipe(e, props.triggerReload)}
            name="recipeForm"
            className="recipeForm"
        >
            <RecipeFormFields idPrefix="recipe" />
            <input className="makeRecipeSubmit button is-primary is-fullwidth" type="submit" value="Add Recipe" />
        </form>
    );
};

module.exports = { RecipeForm, validateRecipeFields };
