const models = require('../models');

const { Recipe } = models;

const recipePage = async (req, res) => res.render('app');

// Create a new recipe
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

  // Save the new recipe to the database
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

// Retrieve all recipes for the logged-in user
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

// Delete a recipe
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

// Update a recipe
const updateRecipe = async (req, res) => {
  if (!req.body._id) {
    return res.status(400).json({ error: 'Recipe ID is required!' });
  }

  if (!req.body.title || !req.body.ingredients || !req.body.instructions
    || !req.body.cookTime || !req.body.difficulty) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  try {
    const result = await Recipe.updateOne(
      {
        _id: req.body._id,
        owner: req.session.account._id,
      },
      {
        // Update fields
        // $set operator sets the value of a field in a document
        // referenced from https://www.mongodb.com/docs/manual/reference/operator/update/set/
        $set: {
          title: req.body.title,
          ingredients: req.body.ingredients,
          instructions: req.body.instructions,
          cookTime: req.body.cookTime,
          difficulty: req.body.difficulty,
        },
      },
    ).exec();

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Recipe not found or unauthorized!' });
    }

    return res.status(200).json({ message: 'Recipe updated successfully!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error updating recipe!' });
  }
};

module.exports = {
  recipePage,
  makeRecipe,
  getRecipes,
  deleteRecipe,
  updateRecipe,
};
