const prisma = require('../config/db');

async function list() {
  return prisma.recipe.findMany({
    include: {
      author: { select: { id: true, username: true } },
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function getById(id) {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, username: true } },
      category: true,
    },
  });

  if (!recipe) {
    const err = new Error('Recette introuvable');
    err.status = 404;
    throw err;
  }

  return recipe;
}

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

module.exports = { list, getById, create };