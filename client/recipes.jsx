const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleRecipe = (e, onRecipeAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#recipeTitle').value;
    const ingredients = e.target.querySelector("#recipeIngredients").value;
    const instructions = e.target.querySelector("#recipeInstructions").value;
    const cookTime = e.target.querySelector("#recipeCookTime").value;
    const difficulty = e.target.querySelector("#recipeDifficulty").value;

    if (!title || !ingredients || !instructions || !cookTime || !difficulty) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { title, ingredients, instructions, cookTime, difficulty }, onRecipeAdded);
    return false;
}

const handleDelete = async (recipeId, onRecipeDeleted) => {
    helper.hideError();

    console.log('Deleting recipe with ID:', recipeId);

    helper.sendPost('/deleteRecipe', { _id: recipeId }, () => {
        console.log('Recipe deleted successfully');
        onRecipeDeleted();
    });
}

const RecipeForm = (props) => {
    return (
        <form id="recipeForm"
            onSubmit={(e) => handleRecipe(e, props.triggerReload)}
            name="recipeForm"
            action="/recipes"
            method="POST"
            className="recipeForm"
        >
            <label htmlFor="title">Title: </label>
            <input id="recipeTitle" type="text" name="title" placeholder="Recipe Title" />
            <label htmlFor="ingredients">Ingredients: </label>
            <textarea id="recipeIngredients" name="ingredients" placeholder="e.g., 2 cups flour, 1 egg..." rows="3"></textarea>
            <label htmlFor="instructions">Instructions: </label>
            <textarea id="recipeInstructions" name="instructions" placeholder="Step by step instructions..." rows="4"></textarea>
            <label htmlFor="cookTime">Cook Time (min): </label>
            <input id="recipeCookTime" type="number" min="1" name="cookTime" placeholder="30" />
            <label htmlFor="difficulty">Difficulty (1-5): </label>
            <input id="recipeDifficulty" type="number" min="1" max="5" name="difficulty" placeholder="1-5" />
            <input className="makeRecipeSubmit" type="submit" value="Add Recipe" />
        </form>
    );
};

const RecipeCard = ({ recipe, onDelete }) => {
    return (
        <div className="recipe">
            <h3 className="recipeTitle">{recipe.title}</h3>
            <div className="recipeDetails">
                <p><strong>Cook Time:</strong> {recipe.cookTime} min</p>
                <p><strong>Difficulty:</strong> {recipe.difficulty}/5</p>
            </div>
            <div className="recipeContent">
                <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
                <p><strong>Instructions:</strong> {recipe.instructions}</p>
            </div>
            <button
                className="deleteRecipeButton"
                onClick={() => handleDelete(recipe._id, onDelete)}
            >
                Delete
            </button>
        </div>
    );
};

const RecipeList = (props) => {
    const [recipes, setRecipes] = useState(props.recipes);

    useEffect(() => {
        const loadRecipesFromServer = async () => {
            const response = await fetch('/getRecipes');
            const data = await response.json();
            setRecipes(data.recipes);
        };
        loadRecipesFromServer();
    }, [props.reloadRecipes]);

    if (recipes.length === 0) {
        return (
            <div className="recipeList">
                <h3 className="emptyRecipe">No Recipes Yet! Add your first recipe above.</h3>
            </div>
        );
    }

    const recipeNodes = recipes.map(recipe => {
        return (
            <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onDelete={props.triggerReload}
            />
        );
    });

    return (
        <div className="recipeList">
            {recipeNodes}
        </div>
    );
};

const App = () => {
    const [reloadRecipes, setReloadRecipes] = useState(false);

    const triggerReload = () => {
        setReloadRecipes(!reloadRecipes);
    };

    return (
        <div>
            <div id="makeRecipe">
                <RecipeForm triggerReload={triggerReload} />
            </div>
            <div id="recipes">
                <RecipeList recipes={[]} reloadRecipes={reloadRecipes} triggerReload={triggerReload} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;