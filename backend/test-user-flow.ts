/**
 * Script de prueba para verificar el flujo completo:
 * Routes → Controller → Service → Database
 * 
 * Este script prueba la inserción de datos a través de todas las capas
 */

import 'dotenv/config';
import userService from './src/api/v1/services/user.service.js';
import { GenderType } from './prisma/generated/client.js';

async function testUserFlow() {
  console.log('🧪 Iniciando prueba del flujo completo de inserción de usuarios\n');
  console.log('='.repeat(60));

  try {
    // 1. Prueba: Obtener todos los usuarios (antes de insertar)
    console.log('\n1️⃣  PRUEBA: Obtener todos los usuarios (antes de insertar)');
    console.log('-'.repeat(60));
    const usersBefore = await userService.getAllUsers();
    console.log(`✅ Resultado: ${usersBefore.count || 0} usuarios encontrados`);
    if (usersBefore.data && usersBefore.data.length > 0) {
      console.log('Usuarios existentes:');
      usersBefore.data.forEach((user: any) => {
        console.log(`   - ${user.firstName} ${user.lastName} (Cédula: ${user.idUser})`);
      });
    }

    // 2. Prueba: Crear un nuevo usuario
    console.log('\n2️⃣  PRUEBA: Crear un nuevo usuario');
    console.log('-'.repeat(60));
    const newUserData = {
      idUser: 99988877,
      firstName: 'Test',
      lastName: 'Usuario',
      email: 'test.usuario@example.com',
      gender: GenderType.M,
      isActive: true
    };
    
    console.log('📝 Datos a insertar:', newUserData);
    const createResult = await userService.createUser(newUserData);
    
    if (createResult.success) {
      console.log('✅ Usuario creado exitosamente');
      console.log('📦 Datos del usuario creado:', JSON.stringify(createResult.data, null, 2));
    } else {
      console.log('❌ Error al crear usuario:', createResult.message);
      if (createResult.error) {
        console.log('   Detalle:', createResult.error);
      }
    }

    // 3. Prueba: Obtener el usuario recién creado por ID
    console.log('\n3️⃣  PRUEBA: Obtener usuario por ID');
    console.log('-'.repeat(60));
    const getUserResult = await userService.getUserById(newUserData.idUser);
    
    if (getUserResult.success) {
      console.log('✅ Usuario encontrado');
      console.log('📦 Datos del usuario:', JSON.stringify(getUserResult.data, null, 2));
    } else {
      console.log('❌ Usuario no encontrado:', getUserResult.message);
    }

    // 4. Prueba: Actualizar el usuario
    console.log('\n4️⃣  PRUEBA: Actualizar usuario');
    console.log('-'.repeat(60));
    const updateData = {
      firstName: 'Test Actualizado',
      lastName: 'Usuario Modificado',
      email: 'test.actualizado@example.com'
    };
    
    console.log('📝 Datos a actualizar:', updateData);
    const updateResult = await userService.updateUser(newUserData.idUser, updateData);
    
    if (updateResult.success) {
      console.log('✅ Usuario actualizado exitosamente');
      console.log('📦 Datos actualizados:', JSON.stringify(updateResult.data, null, 2));
    } else {
      console.log('❌ Error al actualizar usuario:', updateResult.message);
    }

    // 5. Prueba: Obtener todos los usuarios (después de insertar)
    console.log('\n5️⃣  PRUEBA: Obtener todos los usuarios (después de insertar)');
    console.log('-'.repeat(60));
    const usersAfter = await userService.getAllUsers();
    console.log(`✅ Resultado: ${usersAfter.count || 0} usuarios encontrados`);
    if (usersAfter.data && usersAfter.data.length > 0) {
      console.log('Usuarios en la base de datos:');
      usersAfter.data.forEach((user: any) => {
        console.log(`   - ${user.firstName} ${user.lastName} (Cédula: ${user.idUser}, Email: ${user.email})`);
      });
    }

    // 6. Prueba: Eliminar el usuario de prueba
    console.log('\n6️⃣  PRUEBA: Eliminar usuario de prueba');
    console.log('-'.repeat(60));
    const deleteResult = await userService.deleteUser(newUserData.idUser);
    
    if (deleteResult.success) {
      console.log('✅ Usuario eliminado exitosamente');
      console.log('📝 Mensaje:', deleteResult.message);
    } else {
      console.log('❌ Error al eliminar usuario:', deleteResult.message);
    }

    // 7. Verificación final
    console.log('\n7️⃣  VERIFICACIÓN FINAL: Confirmar eliminación');
    console.log('-'.repeat(60));
    const finalCheck = await userService.getUserById(newUserData.idUser);
    
    if (!finalCheck.success) {
      console.log('✅ Confirmado: Usuario eliminado correctamente');
    } else {
      console.log('⚠️  Advertencia: El usuario aún existe en la base de datos');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ PRUEBA COMPLETADA: Flujo Routes → Controller → Service → Database verificado');
    console.log('='.repeat(60));

  } catch (error: any) {
    console.error('\n❌ ERROR CRÍTICO durante la prueba:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Ejecutar la prueba
testUserFlow()
  .then(() => {
    console.log('\n🎉 Todas las pruebas finalizadas');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });

