const prisma = require('../config/db');

async function create(authorId, data) {
  return prisma.recipe.create({
    data: {
      title: data.title,
      description: data.description,
      steps: data.steps,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      servings: data.servings,
      authorId,
    },
  });
}

module.exports = { create };