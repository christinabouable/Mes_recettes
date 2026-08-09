const router = require('express').Router();
const requireAuth = require('../middlewares/auth');
const recipeController = require('../controllers/recipe.controller');

// Routes publiques (pas besoin d'être connecté)
router.get('/', recipeController.list);
router.get('/:id', recipeController.getById);

// Route protégée
router.post('/', requireAuth, recipeController.create);

module.exports = router;