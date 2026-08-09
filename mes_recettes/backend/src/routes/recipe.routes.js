const router = require('express').Router();
const requireAuth = require('../middlewares/auth');
const recipeController = require('../controllers/recipe.controller');

// Routes publiques
router.get('/', recipeController.list);
router.get('/:id', recipeController.getById);

// Routes protégées (auteur uniquement, vérifié dans le service)
router.post('/', requireAuth, recipeController.create);
router.put('/:id', requireAuth, recipeController.update);
router.delete('/:id', requireAuth, recipeController.remove);

module.exports = router;