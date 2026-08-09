const recipeService = require('../services/recipe.service');

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
    const { title, description, steps, prepTime, cookTime, servings } = req.body;

    if (!title || !steps) {
      return res.status(400).json({ error: 'title et steps sont requis' });
    }

    const recipe = await recipeService.create(req.userId, {
      title, description, steps, prepTime, cookTime, servings,
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