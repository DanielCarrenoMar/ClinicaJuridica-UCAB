import 'dotenv/config';
import { PrismaClient } from './generated/client.js'; 
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL no está configurado');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const cedulaABorrar = 10111222; // Cédula de Andrés Pérez

  try {
    await prisma.$connect();
    console.log('🚀 Iniciando prueba de eliminación (DELETE)...\n');

    // --- 1. MOSTRAR ESTADO INICIAL ---
    console.log('1️⃣  LISTA INICIAL (Antes de borrar):');
    const usuariosAntes = await prisma.user.findMany({ orderBy: { idUser: 'asc' } });
    console.table(usuariosAntes.map(u => ({
      'Cédula': u.idUser,
      'Nombre': u.firstName,
      'Email': u.email
    })));

    console.log('\n' + '.'.repeat(40) + '\n');

    // --- 2. ELIMINAR AL USUARIO ---
    console.log(`🗑️  Borrando usuario con cédula: ${cedulaABorrar}...`);
    
    try {
      await prisma.user.delete({
        where: { idUser: cedulaABorrar }
      });
      console.log('✅ Registro eliminado permanentemente de PostgreSQL.\n');
    } catch (e) {
      console.log('⚠️ El usuario no pudo ser borrado (quizás ya no existe).');
    }

    // --- 3. MOSTRAR TABLA FINAL ---
    console.log('2️⃣  LISTA FINAL (Después de borrar):');
    const usuariosDespues = await prisma.user.findMany({ orderBy: { idUser: 'asc' } });
    
    if (usuariosDespues.length > 0) {
      console.table(usuariosDespues.map(u => ({
        'Cédula': u.idUser,
        'Nombre': u.firstName,
        'Email': u.email
      })));
      console.log(`📊 Ahora quedan ${usuariosDespues.length} usuarios en la base de datos.`);
    } else {
      console.log('⚠️ La base de datos ha quedado vacía.');
    }

  } catch (error) {
    console.error('❌ Error durante la operación:', error);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error crítico:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log('\n🔌 Proceso finalizado.');
  });