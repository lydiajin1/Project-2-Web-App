const helper = require('./helper.js');
const React = require('react');
const { validateRecipeFields } = require('./RecipeForm.jsx');
const RecipeFormFields = require('./RecipeFormFields.jsx');

// Handles updating a recipe
const handleUpdate = (e, recipeId, onRecipeUpdated) => {
    e.preventDefault();
    helper.hideError();

    const recipeData = {
        _id: recipeId,
        title: e.target.querySelector('#editRecipeTitle').value,
        ingredients: e.target.querySelector("#editRecipeIngredients").value,
        instructions: e.target.querySelector("#editRecipeInstructions").value,
        cookTime: e.target.querySelector("#editRecipeCookTime").value,
        difficulty: e.target.querySelector("#editRecipeDifficulty").value,
    };

    if (!validateRecipeFields(recipeData)) {
        return false;
    }

    helper.sendPost('/updateRecipe', recipeData, onRecipeUpdated);
    return false;
}

// Component for editing an existing recipe
const EditRecipe = ({ recipe, onCancel, onUpdate }) => {
    return (
        <form id="editRecipeForm"
            onSubmit={(e) => handleUpdate(e, recipe._id, onUpdate)}
            name="editRecipeForm"
            className="recipeForm"
        >
            <h3 style={{ marginBottom: '15px', fontWeight: 'bold' }}>Edit Recipe</h3>
            <RecipeFormFields idPrefix="editRecipe" values={recipe} isEdit={true} />
            <div className="buttons" style={{ display: 'flex', gap: '10px' }}>
                <input className="makeRecipeSubmit button is-primary" type="submit" value="Update Recipe" style={{ marginTop: 0, flex: 1 }} />
                <button type="button" className="deleteRecipeButton button is-danger" onClick={onCancel} style={{ marginTop: 0, flex: 1 }}>Cancel</button>
            </div>
        </form>
    );
};

module.exports = EditRecipe;
