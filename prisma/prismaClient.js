const { PrismaClient } = require('@prisma/client');

const g = global;
const prisma = g.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') g.__prisma = prisma;

module.exports = { prisma }