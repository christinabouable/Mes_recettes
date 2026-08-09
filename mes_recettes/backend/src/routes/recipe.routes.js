const router = require('express').Router();
const requireAuth = require('../middlewares/auth');
const recipeController = require('../controllers/recipe.controller');

// Route protégée : il faut être connecté pour créer une recette
router.post('/', requireAuth, recipeController.create);

module.exports = router;