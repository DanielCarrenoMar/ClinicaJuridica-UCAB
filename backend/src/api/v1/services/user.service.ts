import prisma from '#src/config/database.js';
import { PacketDTO } from '@app/shared/dtos/packets/PacketDTO';
import { PasswordUtil } from '../utils/password.util.js';
import { PacketPaginationDTO } from '@app/shared/dtos/packets/PacketPaginationDTO';
import { UserReqDTO, UserResDTO } from '@app/shared/dtos/UserDTO';

class UserService {
  async getAllUsers(pagination?: { page: number; limit: number; all: boolean }): Promise<PacketPaginationDTO<UserResDTO[]>> {
    try {
      const semester = await prisma.semester.findFirst({
        orderBy: { startDate: 'desc' },
      });
      const currentTerm = semester?.term;

      const page = pagination?.page ?? 1;
      const limit = pagination?.limit ?? 15;
      const all = pagination?.all ?? false;
      const offset = (page - 1) * limit;

      const total = await prisma.user.count()

      const users = await prisma.user.findMany(
        {
          select: {
            identityCard: true,
            fullName: true,
            gender: true,
            email: true,
            isActive: true,
            type: true,
          },
          skip: all ? undefined : offset,
          take: all ? undefined : limit,
          orderBy: { fullName: 'asc' }
        }
      )

      const totalPages = all ? 1 : Math.max(1, Math.ceil(total / limit));
      return {
        success: true,
        data: users,
        pagination: {
          page,
          limit: all ? total : limit,
          total,
          totalPages,
          all
        }
      };
    } catch (error: any) {
      console.error(error);
      return { success: false, error: "Error al obtener usuarios", pagination: { page: 1, limit: 0, total: 0, totalPages: 0, all: false } };
    }
  }

  async getUserById(id: string): Promise<PacketDTO<UserResDTO>> {
    try {
      const foundUser = await prisma.user.findUnique({
        where: {
          identityCard: id
        },
        select: {
          identityCard: true,
          fullName: true,
          gender: true,
          email: true,
          isActive: true,
          type: true,
        },
      });

      if (!foundUser) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      return { success: true, data: foundUser };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createUser(data: UserReqDTO): Promise<PacketDTO<UserResDTO>> {
    try {
      const existing = await prisma.user.findMany({
        where: {
          OR: [
            { identityCard: data.identityCard },
            { email: data.email }
          ]
        },
        take: 1
      });

      if (existing.length > 0) {
        return { success: false, message: 'Cedula o Email ya registrado' };
      }

      const hashedPass = await PasswordUtil.hash("admin");

      // Get current term for Teacher record (needed if Coordinator)
      let currentTerm = '';
      if (data.type === 'COORDINATOR') {
        const semester = await prisma.semester.findFirst({ orderBy: { startDate: 'desc' }, take: 1 });
        if (!semester) return { success: false, message: 'No hay semestres activos para registrar al coordinador como profesor.' };
        currentTerm = semester.term;
      }

      await prisma.user.create({
        data: {
          identityCard: data.identityCard,
          fullName: data.fullName,
          email: data.email,
          password: hashedPass,
          isActive: data.isActive ?? true,
          type: data.type,
        }
      })

      if (data.type === 'COORDINATOR') {
        await prisma.coordinator.create({
          data: {
            identityCard: data.identityCard
          }
        });
        await prisma.teacher.create({
          data: {
            identityCard: data.identityCard,
            term: currentTerm,
            type: 'REGULAR'
          }
        });
      }

      return { success: true, message: 'Creado exitosamente' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateUser(id: string, data: UserReqDTO): Promise<PacketDTO<UserResDTO>> {
    try {

      const updatedUser = await prisma.user.update({
        where: { identityCard: id },
        data: {
          fullName: data.fullName,
          email: data.email,
          isActive: data.isActive,
          gender: data.gender,
        }
      })

      return { success: true, message: 'Actualizado correctamente', data: updatedUser };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getUserCases(id: string) {
    try {
      const userRows = await prisma.$queryRaw`SELECT "type" FROM "User" WHERE "identityCard" = ${id}`;
      if (userRows.length === 0) return { success: false, message: 'Usuario no encontrado' };

      const type = userRows[0].type;
      let cases = [];

      if (type === 'P') {
        cases = await prisma.$queryRaw`SELECT * FROM "Case" WHERE "teacherId" = ${id} ORDER BY "createdAt" DESC`;
      } else {
        cases = await prisma.$queryRaw`
          SELECT c.* FROM "Case" c
          INNER JOIN "AssignedStudent" a ON c."idCase" = a."idCase"
          WHERE a."studentId" = ${id}
          ORDER BY c."createdAt" DESC
        `;
      }
      return { success: true, data: cases };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteUser(id: string) {
    try {
      await prisma.$executeRaw`DELETE FROM "User" WHERE "identityCard" = ${id}`;
      return { success: true, message: 'Usuario eliminado' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export default new UserService();
