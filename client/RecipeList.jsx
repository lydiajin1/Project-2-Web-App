const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const EditRecipe = require('./EditRecipe.jsx');

// Handles deleting a recipe
const handleDelete = async (recipeId, onRecipeDeleted) => {
    helper.hideError();

    console.log('Deleting recipe with ID:', recipeId);

    helper.sendPost('/deleteRecipe', { _id: recipeId }, () => {
        console.log('Recipe deleted successfully');
        onRecipeDeleted();
    });
}

// Component to display the list of recipes
const RecipeList = (props) => {
    const [recipes, setRecipes] = useState(props.recipes);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadRecipesFromServer = async () => {
            const response = await fetch('/getRecipes');
            const data = await response.json();
            setRecipes(data.recipes);
        };
        loadRecipesFromServer();
    }, [props.reloadRecipes]);

    const handleEditClick = (recipe) => {
        props.setEditingRecipe(recipe);
    };

    const handleCancelEdit = () => {
        props.setEditingRecipe(null);
    };

    const handleUpdateComplete = () => {
        props.setEditingRecipe(null);
        props.triggerReload();
    };

    if (props.editingRecipe) {
        return (
            <div>
                <EditRecipe
                    recipe={props.editingRecipe}
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

    // Filter recipes based on search query (premium feature)
    // Search implementation using JavaScript array filter() and string includes()
    // Referred to MDN Web Docs on Array.prototype.filter():
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    const filteredRecipes = props.isPremium && searchQuery
        ? recipes.filter(recipe =>
            recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.ingredients.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.instructions.toLowerCase().includes(searchQuery.toLowerCase())
        )
        // If no search query, show all recipes
        : recipes;

    // Generate recipe nodes
    const recipeNodes = filteredRecipes.map(recipe => {
        return (
            <div key={recipe._id} className="recipe box">
                <h3 className="recipeTitle title is-4">{recipe.title}</h3>
                <div className="recipeDetails">
                    <p><strong>Cook Time:</strong> <strong>{recipe.cookTime} min</strong></p>
                    <p><strong>Difficulty:</strong> <strong>{recipe.difficulty}/5</strong></p>
                </div>
                <div className="recipeContent content">
                    <p><strong>Ingredients:</strong></p>
                    <p className="recipeText">{formatText(recipe.ingredients)}</p>
                    <p><strong>Instructions:</strong></p>
                    <p className="recipeText">{formatText(recipe.instructions)}</p>
                </div>
                <div className="buttons" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    {props.isPremium ? (
                        <button
                            className="editRecipeButton button is-primary"
                            style={{ marginTop: 0, flex: 1 }}
                            onClick={() => handleEditClick(recipe)}
                        >
                            Edit
                        </button>
                    ) : (
                        <button
                            className="editRecipeButton button is-primary"
                            style={{ marginTop: 0, flex: 1, opacity: 0.5, cursor: 'not-allowed' }}
                            onClick={() => alert('Upgrade to Premium to edit recipes!')}
                            disabled
                        >
                            Edit (Premium)
                        </button>
                    )}
                    <button
                        className="deleteRecipeButton button is-danger"
                        style={{ marginTop: 0, flex: 1 }}
                        onClick={() => handleDelete(recipe._id, props.triggerReload)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    });

    return (
        <div>
            {props.isPremium && (
                <div className="searchBar field">
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder="🔍 Search recipes by title, ingredients, or instructions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            )}
            <div className="recipeList">
                {recipeNodes}
            </div>
        </div>
    );
};

module.exports = RecipeList;
