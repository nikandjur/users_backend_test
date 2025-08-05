// src/server.ts
import app from './app';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('\nPrisma disconnected. Server stopped.');
  process.exit(0);
});

export { prisma };