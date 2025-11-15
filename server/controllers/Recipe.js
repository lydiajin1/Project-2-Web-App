const models = require('../models');

const { Recipe } = models;

const recipePage = async (req, res) => res.render('app');

const makeRecipe = async (req, res) => {
  if (!req.body.title || !req.body.ingredients || !req.body.instructions
    || !req.body.cookTime || !req.body.difficulty) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // Profit model: Free users have a 5 recipe limit
  try {
    const recipeCount = await Recipe.countDocuments({ owner: req.session.account._id });
    if (recipeCount >= 5 && !req.session.account.isPremium) {
      return res.status(403).json({ error: 'Free users can only create 5 recipes. Upgrade to premium for unlimited recipes!' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred checking recipe limit!' });
  }

  const recipeData = {
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    cookTime: req.body.cookTime,
    difficulty: req.body.difficulty,
    owner: req.session.account._id,
  };

  try {
    const newRecipe = new Recipe(recipeData);
    await newRecipe.save();
    return res.status(201).json({
      title: newRecipe.title,
      ingredients: newRecipe.ingredients,
      instructions: newRecipe.instructions,
      cookTime: newRecipe.cookTime,
      difficulty: newRecipe.difficulty,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Recipe already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred making recipe!' });
  }
};

const getRecipes = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Recipe.find(query).select('title ingredients instructions cookTime difficulty _id').lean().exec();

    return res.json({ recipes: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving recipes!' });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.body._id;

    if (!recipeId) {
      return res.status(400).json({ error: 'Recipe ID is required!' });
    }

    const result = await Recipe.deleteOne({
      _id: recipeId,
      owner: req.session.account._id,
    }).exec();

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Recipe not found or unauthorized!' });
    }

    return res.status(200).json({ message: 'Recipe deleted successfully!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting recipe!' });
  }
};

module.exports = {
  recipePage,
  makeRecipe,
  getRecipes,
  deleteRecipe,
};
