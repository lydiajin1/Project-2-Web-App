const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getRecipes', mid.requiresLogin, controllers.Recipe.getRecipes);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/recipes', mid.requiresLogin, controllers.Recipe.recipePage);
  app.post('/recipes', mid.requiresLogin, controllers.Recipe.makeRecipe);
  app.post('/deleteRecipe', mid.requiresLogin, controllers.Recipe.deleteRecipe);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
