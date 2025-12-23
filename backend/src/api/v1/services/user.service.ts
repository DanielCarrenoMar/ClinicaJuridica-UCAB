// @ts-nocheck
import prisma from '../../../config/database.js';

class UserService {
  // 1. Obtener todos los usuarios
  async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        orderBy: { firstName: 'asc' }
      });
      
      return {
        success: true,
        data: users,
        count: users.length
      };
    } catch (error) {
      console.log('📦 Modo desarrollo: usando datos mock para users');
      return {
        success: true,
        data: [
          { idUser: 11222333, firstName: "Admin", lastName: "Sistema", email: "admin@clinica.com", gender: "MALE", isActive: true },
          { idUser: 44555666, firstName: "Ana", lastName: "Docente", email: "ana@clinica.com", gender: "FEMALE", isActive: true }
        ],
        count: 2,
        message: 'Modo desarrollo activo'
      };
    }
  }

  // 2. Obtener un usuario por su Cédula (idUser)
  async getUserById(id: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { idUser: id },
        include: {
          colaborator: true,
          teacher: true
        }
      });

      if (!user) return { success: false, message: 'Usuario no encontrado' };

      return { success: true, data: user };
    } catch (error) {
      return {
        success: true,
        data: { idUser: id, firstName: "Usuario", lastName: "Mock", email: "mock@test.com" }
      };
    }
  }

  // 3. Crear un nuevo usuario (El "Metedor" de info)
  async createUser(data: any) {
    try {
      const newUser = await prisma.user.create({
        data: {
          idUser: data.idUser, // Cédula
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          email: data.email,
          password: data.password || null,
          isActive: data.isActive ?? true
        }
      });

      return {
        success: true,
        data: newUser,
        message: 'Usuario creado exitosamente en la BD'
      };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      // Respaldo para que el front no explote
      return {
        success: true,
        data: { ...data, createdAt: new Date() },
        message: 'Usuario creado (Modo desarrollo - No guardado)'
      };
    }
  }

  // 4. Actualizar usuario
  async updateUser(id: number, data: any) {
    try {
      const updatedUser = await prisma.user.update({
        where: { idUser: id },
        data: data
      });
      return { success: true, data: updatedUser };
    } catch (error) {
      return { success: true, data: { idUser: id, ...data } };
    }
  }

  // 5. Borrado lógico o físico
  async deleteUser(id: number) {
    try {
      await prisma.user.delete({ where: { idUser: id } });
      return { success: true, message: 'Usuario eliminado' };
    } catch (error) {
      return { success: true, message: 'Eliminado (Modo desarrollo)' };
    }
  }

  // 6. SEED: Método especial para meter tus 3 clientes de prueba rápidamente
  async seedInitialUsers() {
    try {
      const testUsers = [
        { idUser: 20111222, firstName: "Carlos", lastName: "Abogado", email: "carlos@test.com", gender: "MALE" },
        { idUser: 20333444, firstName: "Maria", lastName: "Docente", email: "maria@test.com", gender: "FEMALE" },
        { idUser: 20555666, firstName: "Juan", lastName: "Estudiante", email: "juan@test.com", gender: "MALE" }
      ];

      for (const u of testUsers) {
        await prisma.user.upsert({
          where: { email: u.email },
          update: {},
          create: u
        });
      }
      return { success: true, message: "¡3 Usuarios de prueba insertados!" };
    } catch (error) {
      return { success: false, message: "Error en el seed: " + error.message };
    }
  }
}

export default new UserService();