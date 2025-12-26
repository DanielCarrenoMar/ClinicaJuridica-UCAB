import prisma from '../../../config/database.js';
import { GenderType } from '../../../../prisma/generated/client.js';

class UserService {
  // Obtener todos los usuarios
  async getAllUsers() {
    try {
      // Verificar si prisma está configurado correctamente
      if (!prisma || !prisma.user) {
        throw new Error('Prisma no está configurado correctamente');
      }

      const users = await prisma.user.findMany({
        orderBy: { idUser: 'asc' },
        include: {
          colaborator: true,
          teacher: true
        }
      });
      
      return {
        success: true,
        data: users,
        count: users.length
      };
    } catch (error: any) {
      console.error('Error al obtener usuarios:', error);
      return {
        success: false,
        message: 'Error al obtener usuarios de la base de datos',
        error: error.message
      };
    }
  }

  // Obtener un usuario por su Cédula (idUser)
  async getUserById(id: number) {
    try {
      if (!prisma || !prisma.user) {
        throw new Error('Prisma no está configurado correctamente');
      }

      const user = await prisma.user.findUnique({
        where: { idUser: id },
        include: {
          colaborator: true,
          teacher: true
        }
      });

      if (!user) {
        return { 
          success: false, 
          message: 'Usuario no encontrado' 
        };
      }

      return { success: true, data: user };
    } catch (error: any) {
      console.error('Error al obtener usuario:', error);
      return {
        success: false,
        message: 'Error al obtener usuario de la base de datos',
        error: error.message
      };
    }
  }

  // Crear un nuevo usuario
  async createUser(data: any) {
    try {
      if (!prisma || !prisma.user) {
        throw new Error('Prisma no está configurado correctamente');
      }

      // Validar que no exista un usuario con el mismo idUser o email
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { idUser: data.idUser },
            { email: data.email }
          ]
        }
      });

      if (existingUser) {
        return {
          success: false,
          message: existingUser.idUser === data.idUser 
            ? 'Ya existe un usuario con esta cédula' 
            : 'Ya existe un usuario con este email'
        };
      }

      const newUser = await prisma.user.create({
        data: {
          idUser: data.idUser,
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
        message: 'Usuario creado exitosamente'
      };
    } catch (error: any) {
      console.error('Error al crear usuario:', error);
      
      // Manejar errores específicos de Prisma
      if (error.code === 'P2002') {
        return {
          success: false,
          message: 'Ya existe un usuario con esta cédula o email'
        };
      }

      return {
        success: false,
        message: 'Error al crear usuario en la base de datos',
        error: error.message
      };
    }
  }

  // Actualizar usuario
  async updateUser(id: number, data: any) {
    try {
      if (!prisma || !prisma.user) {
        throw new Error('Prisma no está configurado correctamente');
      }

      // Verificar que el usuario exista
      const existingUser = await prisma.user.findUnique({
        where: { idUser: id }
      });

      if (!existingUser) {
        return {
          success: false,
          message: 'Usuario no encontrado'
        };
      }

      // Si se está actualizando el email, verificar que no esté en uso por otro usuario
      if (data.email && data.email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email: data.email }
        });

        if (emailExists) {
          return {
            success: false,
            message: 'El email ya está en uso por otro usuario'
          };
        }
      }

      const updatedUser = await prisma.user.update({
        where: { idUser: id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          email: data.email,
          password: data.password,
          isActive: data.isActive
        }
      });

      return { 
        success: true, 
        data: updatedUser,
        message: 'Usuario actualizado exitosamente'
      };
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error);
      
      if (error.code === 'P2025') {
        return {
          success: false,
          message: 'Usuario no encontrado'
        };
      }

      return {
        success: false,
        message: 'Error al actualizar usuario en la base de datos',
        error: error.message
      };
    }
  }

  // Eliminar usuario
  async deleteUser(id: number) {
    try {
      if (!prisma || !prisma.user) {
        throw new Error('Prisma no está configurado correctamente');
      }

      // Verificar que el usuario exista
      const existingUser = await prisma.user.findUnique({
        where: { idUser: id }
      });

      if (!existingUser) {
        return {
          success: false,
          message: 'Usuario no encontrado'
        };
      }

      await prisma.user.delete({ 
        where: { idUser: id } 
      });

      return { 
        success: true, 
        message: 'Usuario eliminado exitosamente' 
      };
    } catch (error: any) {
      console.error('Error al eliminar usuario:', error);
      
      if (error.code === 'P2025') {
        return {
          success: false,
          message: 'Usuario no encontrado'
        };
      }

      return {
        success: false,
        message: 'Error al eliminar usuario de la base de datos',
        error: error.message
      };
    }
  }

  // Seed: Poblar la base de datos con usuarios de prueba
  async seedInitialUsers() {
    try {
      if (!prisma || !prisma.user) {
        throw new Error('Prisma no está configurado correctamente');
      }

      const testUsers = [
        { 
          idUser: 20111222, 
          firstName: "Carlos", 
          lastName: "Abogado", 
          email: "carlos@test.com", 
          gender: GenderType.M 
        },
        { 
          idUser: 20333444, 
          firstName: "Maria", 
          lastName: "Docente", 
          email: "maria@test.com", 
          gender: GenderType.F 
        },
        { 
          idUser: 20555666, 
          firstName: "Juan", 
          lastName: "Estudiante", 
          email: "juan@test.com", 
          gender: GenderType.M 
        }
      ];

      const createdUsers = [];
      for (const u of testUsers) {
        const user = await prisma.user.upsert({
          where: { idUser: u.idUser },
          update: {},
          create: u
        });
        createdUsers.push(user);
      }

      return { 
        success: true, 
        message: `${createdUsers.length} usuarios de prueba insertados/actualizados exitosamente`,
        data: createdUsers
      };
    } catch (error: any) {
      console.error('Error en el seed:', error);
      return { 
        success: false, 
        message: "Error al ejecutar el seed de usuarios",
        error: error.message 
      };
    }
  }
}

export default new UserService();