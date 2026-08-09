const recipeService = require('../services/recipe.service');

async function create(req, res, next) {
  try {
    const { title, description, steps, prepTime, cookTime, servings } = req.body;

    if (!title || !steps) {
      return res.status(400).json({ error: 'title et steps sont requis' });
    }

    const recipe = await recipeService.create(req.userId, {
      title,
      description,
      steps,
      prepTime,
      cookTime,
      servings,
    });

    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
}

module.exports = { create };