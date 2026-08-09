require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const recipeRoutes = require('./routes/recipe.routes');

const app = express();

app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/health/db', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json({ status: 'ok', categoriesCount: categories.length });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.use('/api/auth', authRoutes);

app.use('/api/recipes', recipeRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend démarré sur le port ${PORT}`));