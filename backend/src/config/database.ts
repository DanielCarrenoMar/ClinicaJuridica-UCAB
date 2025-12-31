// src/config/database.ts - Exportación CORRECTA
import { PrismaClient } from '../generated/client.js';

// Configuración para Prisma 7+
const prisma = new PrismaClient({
  accelerateUrl: process.env.PRISMA_ACCELERATE_URL || 'http://localhost:3000'
});

export async function connectDatabase() {
  try {
    console.log('🔗 Conectando a la base de datos...');
    await prisma.$connect();
    console.log('✅ Base de datos conectada exitosamente');
    return prisma;
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    return prisma;
  }
}

// Export NAMED export (no default)
export { prisma };
