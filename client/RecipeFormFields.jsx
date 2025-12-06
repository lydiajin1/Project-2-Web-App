const React = require('react');

// Reusable form fields component for recipe forms
// Used by RecipeForm (create) and EditRecipe (update)
const RecipeFormFields = ({ idPrefix = '', values = {}, isEdit = false }) => {
    return (
        <>
            <div className="field">
                <label className="label" htmlFor="title">Title: </label>
                <div className="control">
                    <input className="input" id={`${idPrefix}Title`} type="text" name="title" placeholder={isEdit ? undefined : "Recipe Title"} defaultValue={values.title} />
                </div>
            </div>
            <div className="field">
                <label className="label" htmlFor="ingredients">Ingredients: </label>
                <div className="control">
                    <textarea className="textarea" id={`${idPrefix}Ingredients`} name="ingredients" placeholder={isEdit ? undefined : "e.g., 2 cups flour, 1 egg..."} rows="3" defaultValue={values.ingredients} />
                </div>
            </div>
            <div className="field">
                <label className="label" htmlFor="instructions">Instructions: </label>
                <div className="control">
                    <textarea className="textarea" id={`${idPrefix}Instructions`} name="instructions" placeholder={isEdit ? undefined : "Step by step instructions..."} rows="4" defaultValue={values.instructions} />
                </div>
            </div>
            <div className="field">
                <label className="label" htmlFor="cookTime">Cook Time (min): </label>
                <div className="control">
                    <input className="input" id={`${idPrefix}CookTime`} type="number" min="1" name="cookTime" placeholder={isEdit ? undefined : "30"} defaultValue={values.cookTime} />
                </div>
            </div>
            <div className="field">
                <label className="label" htmlFor="difficulty">Difficulty (1-5): </label>
                <div className="control">
                    <input className="input" id={`${idPrefix}Difficulty`} type="number" min="1" max="5" name="difficulty" placeholder={isEdit ? undefined : "1-5"} defaultValue={values.difficulty} />
                </div>
            </div>
        </>
    );
};

module.exports = RecipeFormFields;
