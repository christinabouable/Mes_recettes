const router = require('express').Router();
const prisma = require('../config/db');

// Liste des catégories (public)
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

module.exports = router;