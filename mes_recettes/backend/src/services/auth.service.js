const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

async function register({ email, username, password }) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    const err = new Error("Email ou nom d'utilisateur déjà utilisé");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, username, passwordHash },
  });

  return { id: user.id, email: user.email, username: user.username };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('Identifiants invalides');
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err = new Error('Identifiants invalides');
    err.status = 401;
    throw err;
  }

  const accessToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

  return {
    user: { id: user.id, email: user.email, username: user.username },
    accessToken,
  };
}

module.exports = { register, login };