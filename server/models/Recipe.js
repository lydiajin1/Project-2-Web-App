const mongoose = require('mongoose');
const _ = require('underscore');

const setTitle = (title) => _.escape(title).trim();

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },
  ingredients: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  cookTime: {
    type: Number,
    min: 1,
    required: true,
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
    default: 1,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

RecipeSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  ingredients: doc.ingredients,
  instructions: doc.instructions,
  cookTime: doc.cookTime,
  difficulty: doc.difficulty,
  _id: doc._id,
});

const RecipeModel = mongoose.model('Recipe', RecipeSchema);
module.exports = RecipeModel;
