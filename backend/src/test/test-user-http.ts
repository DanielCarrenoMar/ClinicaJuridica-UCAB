/*import 'dotenv/config';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api/v1';
const GENDER_TYPES = { M: 'M', F: 'F', O: 'O' };

async function makeRequest(method: string, endpoint: string, data?: any) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return {
      status: response.status,
      success: response.ok,
      data: result
    };
  } catch (error: any) {
    return {
      status: 0,
      success: false,
      error: error.message
    };
  }
}

async function testUserFlowHTTP() {
  console.log('🌐 Iniciando prueba HTTP del flujo completo de usuarios\n');
  console.log('='.repeat(60));
  console.log(`📍 Servidor: ${API_BASE_URL}`);
  console.log('='.repeat(60));

  const testUserId = 88877766;
  const testUserEmail = `test.http.${Date.now()}@example.com`;

  try {
    // 1. Prueba: Obtener todos los usuarios (antes de insertar)
    console.log('\n1️⃣  PRUEBA HTTP: GET /users - Obtener todos los usuarios');
    console.log('-'.repeat(60));
    const usersBefore = await makeRequest('GET', '/users');
    console.log(`📊 Status: ${usersBefore.status}`);
    if (usersBefore.success) {
      console.log(`✅ ${usersBefore.data.count || 0} usuarios encontrados`);
      if (usersBefore.data.data && usersBefore.data.data.length > 0) {
        console.log('Usuarios existentes:');
        usersBefore.data.data.forEach((user: any) => {
          console.log(`   - ${user.firstName} ${user.lastName} (Cédula: ${user.idUser}, Email: ${user.email})`);
        });
      }
    } else {
      console.log('❌ Error:', usersBefore.data?.message || usersBefore.error);
    }

    // 2. Prueba: Crear un nuevo usuario
    console.log('\n2️⃣  PRUEBA HTTP: POST /users - Crear un nuevo usuario');
    console.log('-'.repeat(60));
    const newUserData = {
      idUser: testUserId,
      firstName: 'Test',
      lastName: 'HTTP',
      email: testUserEmail,
      gender: GENDER_TYPES.M,
      isActive: true
    };
    
    console.log('📝 Datos a insertar:', JSON.stringify(newUserData, null, 2));
    const createResult = await makeRequest('POST', '/users', newUserData);
    console.log(`📊 Status: ${createResult.status}`);
    
    if (createResult.success) {
      console.log('✅ Usuario creado exitosamente');
      console.log('📦 Respuesta:', JSON.stringify(createResult.data, null, 2));
    } else {
      console.log('❌ Error al crear usuario');
      console.log('📦 Respuesta:', JSON.stringify(createResult.data || createResult.error, null, 2));
    }

    // 3. Prueba: Obtener el usuario recién creado por ID
    console.log('\n3️⃣  PRUEBA HTTP: GET /users/:id - Obtener usuario por ID');
    console.log('-'.repeat(60));
    const getUserResult = await makeRequest('GET', `/users/${testUserId}`);
    console.log(`📊 Status: ${getUserResult.status}`);
    
    if (getUserResult.success) {
      console.log('✅ Usuario encontrado');
      console.log('📦 Datos del usuario:', JSON.stringify(getUserResult.data.data, null, 2));
    } else {
      console.log('❌ Usuario no encontrado');
      console.log('📦 Respuesta:', JSON.stringify(getUserResult.data || getUserResult.error, null, 2));
    }

    // 4. Prueba: Actualizar el usuario
    console.log('\n4️⃣  PRUEBA HTTP: PUT /users/:id - Actualizar usuario');
    console.log('-'.repeat(60));
    const updateData = {
      firstName: 'Test Actualizado',
      lastName: 'HTTP Modificado',
      email: `test.actualizado.${Date.now()}@example.com`
    };
    
    console.log('📝 Datos a actualizar:', JSON.stringify(updateData, null, 2));
    const updateResult = await makeRequest('PUT', `/users/${testUserId}`, updateData);
    console.log(`📊 Status: ${updateResult.status}`);
    
    if (updateResult.success) {
      console.log('✅ Usuario actualizado exitosamente');
      console.log('📦 Datos actualizados:', JSON.stringify(updateResult.data.data, null, 2));
    } else {
      console.log('❌ Error al actualizar usuario');
      console.log('📦 Respuesta:', JSON.stringify(updateResult.data || updateResult.error, null, 2));
    }

    // 5. Prueba: Obtener todos los usuarios (después de insertar)
    console.log('\n5️⃣  PRUEBA HTTP: GET /users - Obtener todos los usuarios (después)');
    console.log('-'.repeat(60));
    const usersAfter = await makeRequest('GET', '/users');
    console.log(`📊 Status: ${usersAfter.status}`);
    if (usersAfter.success) {
      console.log(`✅ ${usersAfter.data.count || 0} usuarios encontrados`);
      if (usersAfter.data.data && usersAfter.data.data.length > 0) {
        console.log('Usuarios en la base de datos:');
        usersAfter.data.data.forEach((user: any) => {
          console.log(`   - ${user.firstName} ${user.lastName} (Cédula: ${user.idUser}, Email: ${user.email})`);
        });
      }
    } else {
      console.log('❌ Error:', usersAfter.data?.message || usersAfter.error);
    }

    // 6. Prueba: Eliminar el usuario de prueba
    console.log('\n6️⃣  PRUEBA HTTP: DELETE /users/:id - Eliminar usuario');
    console.log('-'.repeat(60));
    const deleteResult = await makeRequest('DELETE', `/users/${testUserId}`);
    console.log(`📊 Status: ${deleteResult.status}`);
    
    if (deleteResult.success) {
      console.log('✅ Usuario eliminado exitosamente');
      console.log('📝 Mensaje:', deleteResult.data?.message);
    } else {
      console.log('❌ Error al eliminar usuario');
      console.log('📦 Respuesta:', JSON.stringify(deleteResult.data || deleteResult.error, null, 2));
    }

    // 7. Verificación final
    console.log('\n7️⃣  VERIFICACIÓN FINAL: Confirmar eliminación');
    console.log('-'.repeat(60));
    const finalCheck = await makeRequest('GET', `/users/${testUserId}`);
    console.log(`📊 Status: ${finalCheck.status}`);
    
    if (!finalCheck.success && finalCheck.status === 404) {
      console.log('✅ Confirmado: Usuario eliminado correctamente (404 Not Found)');
    } else if (finalCheck.success) {
      console.log('⚠️  Advertencia: El usuario aún existe en la base de datos');
    } else {
      console.log('📦 Respuesta:', JSON.stringify(finalCheck.data || finalCheck.error, null, 2));
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ PRUEBA HTTP COMPLETADA: Flujo HTTP → Routes → Controller → Service → Database verificado');
    console.log('='.repeat(60));

  } catch (error: any) {
    console.error('\n❌ ERROR CRÍTICO durante la prueba HTTP:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Verificar que el servidor esté corriendo
async function checkServer() {
  try {
    const response = await fetch(`${API_BASE_URL}/test`);
    if (response.ok) {
      console.log('✅ Servidor está corriendo\n');
      return true;
    }
  } catch (error) {
    console.error('❌ Error: El servidor no está corriendo o no es accesible');
    console.error(`   Por favor, inicia el servidor con: npm run dev`);
    console.error(`   URL esperada: ${API_BASE_URL}\n`);
    return false;
  }
  return false;
}

// Ejecutar la prueba
checkServer()
  .then((serverRunning) => {
    if (serverRunning) {
      return testUserFlowHTTP();
    } else {
      process.exit(1);
    }
  })
  .then(() => {
    console.log('\n🎉 Todas las pruebas HTTP finalizadas');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });

*/