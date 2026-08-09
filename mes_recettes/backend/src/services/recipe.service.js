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

async function update(id, userId, data) {
  await ensureOwnership(id, userId);

  return prisma.recipe.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      steps: data.steps,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      servings: data.servings,
    },
  });
}

async function remove(id, userId) {
  await ensureOwnership(id, userId);
  return prisma.recipe.delete({ where: { id } });
}

// Vérifie que la recette existe ET que l'utilisateur en est bien l'auteur
async function ensureOwnership(id, userId) {
  const recipe = await prisma.recipe.findUnique({ where: { id } });

  if (!recipe) {
    const err = new Error('Recette introuvable');
    err.status = 404;
    throw err;
  }

  if (recipe.authorId !== userId) {
    const err = new Error('Vous n\'êtes pas autorisé à modifier cette recette');
    err.status = 403;
    throw err;
  }
}

module.exports = { list, getById, create, update, remove };