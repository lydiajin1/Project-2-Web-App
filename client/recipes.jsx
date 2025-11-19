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

const PremiumBanner = () => {
    const [isPremium, setIsPremium] = useState(false);
    const [recipeCount, setRecipeCount] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            const accountResponse = await fetch('/getAccountInfo');
            const accountData = await accountResponse.json();
            setIsPremium(accountData.isPremium);

            const recipeResponse = await fetch('/getRecipes');
            const recipeData = await recipeResponse.json();
            setRecipeCount(recipeData.recipes.length);
        };
        loadData();
    }, []);

    const handleUpgrade = async () => {
        const response = await fetch('/upgradePremium', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        if (result.message) {
            setIsPremium(true);
            alert('Upgraded to premium! You now have unlimited recipes!');
        }
    };

    if (isPremium) {
        return (
            <div className="premiumBanner" style={{ backgroundColor: '#095d63', color: 'white' }}>
                <p className="recipeCount" style={{ color: 'white' }}>Premium Account - Unlimited Recipes!</p>
                <a href="/changePassword" className="changePasswordLink">Change Password</a>
            </div>
        );
    }

    return (
        <div className="premiumBanner">
            <p className="recipeCount">Recipes: {recipeCount} / 5 (Free Plan)</p>
            <button className="upgradeButton" onClick={handleUpgrade}>
                Upgrade to Premium - Unlimited Recipes!
            </button>
            <a href="/changePassword" className="changePasswordLink">Change Password</a>
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
            <PremiumBanner />
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