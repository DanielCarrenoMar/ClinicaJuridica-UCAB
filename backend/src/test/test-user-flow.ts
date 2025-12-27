import 'dotenv/config';
import userService from './src/api/v1/services/user.service.js';

async function testUserFlow() {
  console.log('🧪 Iniciando prueba del flujo completo de inserción de usuarios\n');
  console.log('='.repeat(60));

  try {
    // 1. Prueba: Obtener todos los usuarios
    console.log('\n1️⃣  PRUEBA: Obtener todos los usuarios (antes de insertar)');
    console.log('-'.repeat(60));
    const usersBefore = await userService.getAllUsers();
    console.log(`✅ Resultado: ${usersBefore.count || 0} usuarios encontrados`);

    // 2. Prueba: Crear un nuevo usuario
    console.log('\n2️⃣  PRUEBA: Crear un nuevo usuario');
    console.log('-'.repeat(60));

    const newUserData = {
      identityCard: "99988877",
      name: 'Test Usuario',
      email: 'test.usuario@example.com',
      password: 'password123',
      gender: "M",
      isActive: true,
      type: "STUDENT"
    };

    console.log('📝 Datos a insertar:', newUserData);
    const createResult = await userService.createUser(newUserData);

    if (createResult.success) {
      console.log('✅ Usuario creado exitosamente');
      console.log('📦 Datos del usuario creado:', JSON.stringify(createResult.data, null, 2));
    } else {
      console.log('❌ Error al crear usuario:', createResult.message);
      if (createResult.error) console.log('   Detalle:', createResult.error);
      return;
    }

    // 3. Prueba: Obtener por ID
    console.log('\n3️⃣  PRUEBA: Obtener usuario por ID');
    console.log('-'.repeat(60));
    const getUserResult = await userService.getUserById(newUserData.identityCard);

    if (getUserResult.success) {
      console.log('✅ Usuario encontrado');
    } else {
      console.log('❌ Usuario no encontrado:', getUserResult.message);
    }

    // 4. Prueba: Actualizar el usuario
    console.log('\n4️⃣  PRUEBA: Actualizar usuario');
    console.log('-'.repeat(60));
    const updateData = {
      name: 'Test Usuario Actualizado',
      email: 'test.actualizado@example.com'
    };

    console.log('📝 Datos a actualizar:', updateData);
    const updateResult = await userService.updateUser(newUserData.identityCard, updateData);

    if (updateResult.success) {
      console.log('✅ Usuario actualizado exitosamente');
    } else {
      console.log('❌ Error al actualizar usuario:', updateResult.message);
    }

    // 6. Prueba: Eliminar el usuario de prueba
    // SE COMENTA PARA PODER VER EL REGISTRO EN PRISMA STUDIO
    console.log('\n6️⃣  PRUEBA: Eliminar usuario de prueba');
    console.log('-'.repeat(60));
    const deleteResult = await userService.deleteUser(newUserData.identityCard);

    if (deleteResult.success) {
      console.log('✅ Usuario eliminado exitosamente');
    } else {
      console.log('❌ Error al eliminar usuario:', deleteResult.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ PRUEBA COMPLETADA: Registro persistido en la DB');
    console.log('='.repeat(60));

  } catch (error: any) {
    console.error('\n❌ ERROR CRÍTICO durante la prueba:', error);
    process.exit(1);
  }
}

testUserFlow()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));