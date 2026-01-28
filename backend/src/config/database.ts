import 'dotenv/config';
import { PrismaClient } from '#src/generated/client.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from '#src/config.js';

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL no está configurado en las variables de entorno. Por favor, configura DATABASE_URL en tu archivo .env');
}

let prisma: PrismaClient;

try {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} catch (error) {
  console.error('❌ Error al configurar Prisma:', error);
  throw error;
}

export default prisma;