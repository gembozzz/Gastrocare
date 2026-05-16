// ============================================
// Database Configuration (Prisma Client)
// Uses PostgreSQL via the standard Prisma engine
// ============================================

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

/**
 * Test database connection
 */
async function connectDatabase() {
  await prisma.$connect();
}

/**
 * Graceful shutdown
 */
async function disconnectDatabase() {
  await prisma.$disconnect();
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});

module.exports = { prisma, connectDatabase, disconnectDatabase };
