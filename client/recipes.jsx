const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// Handles form submission for adding a new recipe
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

// Handles deleting a recipe
const handleDelete = async (recipeId, onRecipeDeleted) => {
    helper.hideError();

    console.log('Deleting recipe with ID:', recipeId);

    helper.sendPost('/deleteRecipe', { _id: recipeId }, () => {
        console.log('Recipe deleted successfully');
        onRecipeDeleted();
    });
}

// Handles updating a recipe
const handleUpdate = (e, recipeId, onRecipeUpdated) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#editRecipeTitle').value;
    const ingredients = e.target.querySelector("#editRecipeIngredients").value;
    const instructions = e.target.querySelector("#editRecipeInstructions").value;
    const cookTime = e.target.querySelector("#editRecipeCookTime").value;
    const difficulty = e.target.querySelector("#editRecipeDifficulty").value;

    if (!title || !ingredients || !instructions || !cookTime || !difficulty) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost('/updateRecipe', { _id: recipeId, title, ingredients, instructions, cookTime, difficulty }, onRecipeUpdated);
    return false;
}

// Component for the recipe submission form
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

// Component for editing an existing recipe
const EditRecipe = ({ recipe, onCancel, onUpdate }) => {
    return (
        <form id="editRecipeForm"
            onSubmit={(e) => handleUpdate(e, recipe._id, onUpdate)}
            name="editRecipeForm"
            className="recipeForm"
        >
            <h3 style={{ marginBottom: '15px'}}>Edit Recipe</h3>
            <label htmlFor="title">Title: </label>
            <input id="editRecipeTitle" type="text" name="title" defaultValue={recipe.title} />
            <label htmlFor="ingredients">Ingredients: </label>
            <textarea id="editRecipeIngredients" name="ingredients" defaultValue={recipe.ingredients} rows="3"></textarea>
            <label htmlFor="instructions">Instructions: </label>
            <textarea id="editRecipeInstructions" name="instructions" defaultValue={recipe.instructions} rows="4"></textarea>
            <label htmlFor="cookTime">Cook Time (min): </label>
            <input id="editRecipeCookTime" type="number" min="1" name="cookTime" defaultValue={recipe.cookTime} />
            <label htmlFor="difficulty">Difficulty (1-5): </label>
            <input id="editRecipeDifficulty" type="number" min="1" max="5" name="difficulty" defaultValue={recipe.difficulty} />
            <div style={{display: 'flex', gap: '10px'}}>
                <input className="makeRecipeSubmit" type="submit" value="Update Recipe" />
                <button type="button" className="deleteRecipeButton" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

// Component to display the list of recipes
const RecipeList = (props) => {
    const [recipes, setRecipes] = useState(props.recipes);
    const [editingRecipe, setEditingRecipe] = useState(null);

    useEffect(() => {
        const loadRecipesFromServer = async () => {
            const response = await fetch('/getRecipes');
            const data = await response.json();
            setRecipes(data.recipes);
        };
        loadRecipesFromServer();
    }, [props.reloadRecipes]);

    const handleEditClick = (recipe) => {
        setEditingRecipe(recipe);
    };

    const handleCancelEdit = () => {
        setEditingRecipe(null);
    };

    const handleUpdateComplete = () => {
        setEditingRecipe(null);
        props.triggerReload();
    };

    if (editingRecipe) {
        return (
            <div>
                <EditRecipe
                    recipe={editingRecipe}
                    onCancel={handleCancelEdit}
                    onUpdate={handleUpdateComplete}
                />
            </div>
        );
    }

    if (recipes.length === 0) {
        return (
            <div className="recipeList">
                <h3 className="emptyRecipe">No Recipes Yet! Add your first recipe above.</h3>
            </div>
        );
    }

    // Function to format text with line breaks
    // Sourced from dev community article to learn how to use the \n newline character in React
    // and properly formatting the text to display line breaks instead of one big block of text
    // https://dev.to/yuya0114/how-to-display-line-breaks-in-react-for-the-n-newline-character-3b0h
    const formatText = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                {index < text.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    const recipeNodes = recipes.map(recipe => {
        return (
            <div key={recipe._id} className="recipe">
                <h3 className="recipeTitle">{recipe.title}</h3>
                <div className="recipeDetails">
                    <p><strong>Cook Time:</strong> {recipe.cookTime} min</p>
                    <p><strong>Difficulty:</strong> {recipe.difficulty}/5</p>
                </div>
                <div className="recipeContent">
                    <p><strong>Ingredients:</strong></p>
                    <p className="recipeText">{formatText(recipe.ingredients)}</p>
                    <p><strong>Instructions:</strong></p>
                    <p className="recipeText">{formatText(recipe.instructions)}</p>
                </div>
                <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                    <button
                        className="makeRecipeSubmit"
                        style={{marginTop: 0, flex: 1}}
                        onClick={() => handleEditClick(recipe)}
                    >
                        Edit
                    </button>
                    <button
                        className="deleteRecipeButton"
                        style={{marginTop: 0, flex: 1}}
                        onClick={() => handleDelete(recipe._id, props.triggerReload)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    });

    return (
        <div className="recipeList">
            {recipeNodes}
        </div>
    );
};

// Component for displaying premium status and upgrade option
const PremiumBanner = ({ recipeCount, isPremium, onUpgrade }) => {
    const handleUpgrade = async () => {
        const response = await fetch('/upgradePremium', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        if (result.message) {
            alert('Upgraded to premium! You now have unlimited recipes!');
            onUpgrade();
        }
    };

    if (isPremium) {
        return (
            <div className="premiumBanner">
                <p className="recipeCount">Premium Account - Unlimited Recipes!</p>
            </div>
        );
    }

    return (
        <div className="premiumBanner">
            <p className="recipeCount">Recipes: {recipeCount} / 5 (Free Plan)</p>
            <button className="upgradeButton" onClick={handleUpgrade}>
                Upgrade to Premium
            </button>
        </div>
    );
};

// Main application component
const App = () => {
    const [reloadRecipes, setReloadRecipes] = useState(false);
    const [recipeCount, setRecipeCount] = useState(0);
    const [isPremium, setIsPremium] = useState(false);

    // Load account info on initial render
    useEffect(() => {
        const loadAccountInfo = async () => {
            const accountResponse = await fetch('/getAccountInfo');
            const accountData = await accountResponse.json();
            setIsPremium(accountData.isPremium);
        };
        loadAccountInfo();
    }, []);

    // Load recipe count on initial render and when recipes are reloaded
    // Refered to https://react.dev/learn/synchronizing-with-effects for useEffect dependencies and 
    // how to properly reload data immediately when a recipe is added or deleted 
    useEffect(() => {
        const loadRecipeCount = async () => {
            const recipeResponse = await fetch('/getRecipes');
            const recipeData = await recipeResponse.json();
            setRecipeCount(recipeData.recipes.length);
        };
        loadRecipeCount();
    }, [reloadRecipes]);

    const triggerReload = () => {
        setReloadRecipes(!reloadRecipes);
    };

    const handleUpgrade = () => {
        setIsPremium(true);
    };

    return (
        <div>
            <PremiumBanner recipeCount={recipeCount} isPremium={isPremium} onUpgrade={handleUpgrade} />
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