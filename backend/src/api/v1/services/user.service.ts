import prisma from '../../../config/database.js';

class UserService {
  // Mapeo interno para convertir cualquier entrada (E, P, C o nombres largos) 
  // a los nombres de símbolos que Prisma espera en su API.
  private normalizeType(type: string): any {
    if (!type) return undefined;
    const t = type.toUpperCase();
    if (t === 'STUDENT' || t === 'E') return 'STUDENT';
    if (t === 'TEACHER' || t === 'P') return 'TEACHER';
    if (t === 'COORDINATOR' || t === 'C') return 'COORDINATOR';
    return t;
  }

  private normalizeGender(gender: string): any {
    if (!gender) return undefined;
    const g = gender.toUpperCase();
    if (g === 'M') return 'M';
    if (g === 'F') return 'F';
    return g;
  }

  async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        orderBy: { identityCard: 'asc' },
        include: { teachers: true, students: true, coordinator: true }
      });
      return { success: true, data: users, count: users.length };
    } catch (error: any) {
      return { success: false, message: 'Error al obtener usuarios', error: error.message };
    }
  }

  async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { identityCard: id },
        include: { teachers: true, students: true, coordinator: true }
      });
      if (!user) return { success: false, message: 'Usuario no encontrado' };
      return { success: true, data: user };
    } catch (error: any) {
      return { success: false, message: 'Error al buscar usuario', error: error.message };
    }
  }

  async createUser(data: any) {
    try {
      if (!prisma?.user) throw new Error('Prisma no está configurado');

      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ identityCard: data.identityCard }, { email: data.email }] }
      });

      if (existingUser) {
        return {
          success: false,
          message: existingUser.identityCard === data.identityCard
            ? 'Ya existe un usuario con esta cédula'
            : 'Ya existe un usuario con este email'
        };
      }

      const newUser = await prisma.user.create({
        data: {
          identityCard: data.identityCard,
          name: data.name,
          email: data.email,
          password: data.password,
          isActive: data.isActive ?? true,
          type: this.normalizeType(data.type),
          gender: this.normalizeGender(data.gender)
        }
      });

      return { success: true, data: newUser, message: 'Usuario creado exitosamente' };
    } catch (error: any) {
      console.error('Error en createUser:', error);
      return { success: false, message: 'Error al crear usuario', error: error.message };
    }
  }

  async updateUser(id: string, data: any) {
    try {
      const updateData: any = { ...data };

      if (data.type) updateData.type = this.normalizeType(data.type);
      if (data.gender) updateData.gender = this.normalizeGender(data.gender);

      const updatedUser = await prisma.user.update({
        where: { identityCard: id },
        data: updateData
      });

      return { success: true, data: updatedUser, message: 'Usuario actualizado' };
    } catch (error: any) {
      return { success: false, message: 'Error al actualizar', error: error.message };
    }
  }

  async deleteUser(id: string) {
    try {
      await prisma.user.delete({ where: { identityCard: id } });
      return { success: true, message: 'Usuario eliminado' };
    } catch (error: any) {
      return { success: false, message: 'Error al eliminar', error: error.message };
    }
  }

  async seedInitialUsers() {
    try {
      const testUsers = [
        { identityCard: "20111222", name: "Carlos Abogado", email: "carlos@test.com", password: "password123", gender: "M", type: "TEACHER" },
        { identityCard: "20333444", name: "Maria Docente", email: "maria@test.com", password: "password123", gender: "F", type: "TEACHER" },
        { identityCard: "20555666", name: "Juan Estudiante", email: "juan@test.com", password: "password123", gender: "M", type: "STUDENT" }
      ];

      for (const u of testUsers) {
        await prisma.user.upsert({
          where: { identityCard: u.identityCard },
          update: {},
          create: u as any
        });
      }
      return { success: true, message: 'Seed completado' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export default new UserService();