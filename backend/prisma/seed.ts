import 'dotenv/config';
import { PrismaClient } from './generated/client.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Crear el pool de conexiones de PostgreSQL
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL no está configurado en las variables de entorno');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔍 Ejecutando SELECT en la base de datos PostgreSQL...');
  console.log(`📡 DATABASE_URL: ${process.env.DATABASE_URL ? 'Configurado ✓' : '❌ NO CONFIGURADO'}\n`);

  // Verificar conexión
  try {
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos PostgreSQL\n');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    throw error;
  }

  // SELECT: Buscar usuario con cédula 20333444 que ya existe en la BD
  const cedulaUsuario = 20333444;
  console.log('='.repeat(60));
  console.log('🔍 CONSULTAR (SELECT) usuario de la BD');
  console.log('='.repeat(60));
  console.log(`🔎 Buscando usuario con cédula: ${cedulaUsuario}`);
  console.log('📝 Ejecutando: SELECT * FROM "Users" WHERE "idUser" = 20333444\n');
  
  try {
    const usuario = await prisma.user.findUnique({
      where: {
        idUser: cedulaUsuario
      }
    });

    if (usuario) {
      console.log('✅ Usuario encontrado en la base de datos:');
      console.log('='.repeat(60));
      console.log('📊 Datos del usuario consultado:');
      console.table([{
        'Cédula (idUser)': usuario.idUser,
        'Nombre': `${usuario.firstName} ${usuario.lastName}`,
        'Email': usuario.email,
        'Género': usuario.gender,
        'Activo': usuario.isActive ? 'Sí' : 'No',
        'Password': usuario.password ? '***' : 'No definido'
      }]);
      
      console.log('\n📄 Objeto completo retornado de la BD:');
      console.log(JSON.stringify(usuario, null, 2));
      
      console.log('\n' + '='.repeat(60));
      console.log('✅ SELECT ejecutado exitosamente');
      console.log('='.repeat(60));
    } else {
      console.log(`❌ No se encontró ningún usuario con la cédula ${cedulaUsuario}`);
      console.log('⚠️  Verifica que el usuario exista en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error al ejecutar SELECT:', error);
    throw error;
  }

  console.log('\n🎉 Consulta completada correctamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });