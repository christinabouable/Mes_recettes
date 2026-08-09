const recipeService = require('../services/recipe.service');
const { uploadImage } = require('../config/minio');

async function list(req, res, next) {
  try {
    const recipes = await recipeService.list();
    res.json(recipes);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const recipe = await recipeService.getById(req.params.id);
    res.json(recipe);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { title, description } = req.body;
    const steps = typeof req.body.steps === 'string' ? JSON.parse(req.body.steps) : req.body.steps;

    const prepTime = req.body.prepTime ? parseInt(req.body.prepTime, 10) : null;
    const cookTime = req.body.cookTime ? parseInt(req.body.cookTime, 10) : null;
    const servings = req.body.servings ? parseInt(req.body.servings, 10) : null;

    if (!title || !steps) {
      return res.status(400).json({ error: 'title et steps sont requis' });
    }

    let imageUrl = null;
    if (req.file) {
      const filename = `${Date.now()}-${req.file.originalname}`;
      imageUrl = await uploadImage(req.file.buffer, filename, req.file.mimetype);
    }

    const recipe = await recipeService.create(req.userId, {
      title, description, steps, prepTime, cookTime, servings, imageUrl,
    });

    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { title, description, steps, prepTime, cookTime, servings } = req.body;
    const recipe = await recipeService.update(req.params.id, req.userId, {
      title, description, steps, prepTime, cookTime, servings,
    });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await recipeService.remove(req.params.id, req.userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };