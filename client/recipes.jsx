const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { RecipeForm } = require('./RecipeForm.jsx');
const RecipeList = require('./RecipeList.jsx');
const PremiumBanner = require('./PremiumBanner.jsx');

// Main application component
const App = () => {
    const [reloadRecipes, setReloadRecipes] = useState(false);
    const [recipeCount, setRecipeCount] = useState(0);
    const [isPremium, setIsPremium] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);

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

    // Render the application UI
    return (
        <div>
            <PremiumBanner recipeCount={recipeCount} isPremium={isPremium} onUpgrade={handleUpgrade} />
            {editingRecipe ? (
                <div className="container" style={{ padding: '40px 30px', maxWidth: '800px', margin: '0 auto' }}>
                    <div id="recipes">
                        <RecipeList
                            recipes={[]}
                            reloadRecipes={reloadRecipes}
                            triggerReload={triggerReload}
                            editingRecipe={editingRecipe}
                            setEditingRecipe={setEditingRecipe}
                            isPremium={isPremium}
                        />
                    </div>
                </div>
            ) : (
                <div className="container is-fluid" style={{ padding: '40px 30px' }}>
                    <div className="columns">
                        <div className="column is-4">
                            <div id="makeRecipe" style={{ position: 'sticky', top: '20px' }}>
                                <RecipeForm triggerReload={triggerReload} />
                            </div>
                        </div>
                        <div className="column is-8">
                            <div id="recipes">
                                <RecipeList
                                    recipes={[]}
                                    reloadRecipes={reloadRecipes}
                                    triggerReload={triggerReload}
                                    editingRecipe={editingRecipe}
                                    setEditingRecipe={setEditingRecipe}
                                    isPremium={isPremium}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Initialize and render the App component
const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;