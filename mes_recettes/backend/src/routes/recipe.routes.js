const router = require('express').Router();
const multer = require('multer');
const requireAuth = require('../middlewares/auth');
const recipeController = require('../controllers/recipe.controller');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', recipeController.list);
router.get('/:id', recipeController.getById);

router.post('/', requireAuth, upload.single('image'), recipeController.create);
router.put('/:id', requireAuth, recipeController.update);
router.delete('/:id', requireAuth, recipeController.remove);

module.exports = router;