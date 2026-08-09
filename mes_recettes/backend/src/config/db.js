const { PrismaClient } = require('@prisma/client');

// Instance unique de Prisma partagée dans toute l'app
const prisma = new PrismaClient();

module.exports = prisma;