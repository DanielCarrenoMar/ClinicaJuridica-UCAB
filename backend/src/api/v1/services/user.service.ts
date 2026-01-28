// @ts-nocheck
import prisma from '#src/config/database.js';
import { PasswordUtil } from '../utils/password.util.js';

class UserService {
  private normalizeType(type: string): string {
    if (!type) return 'E';
    const t = type.toUpperCase();
    if (t === 'STUDENT' || t === 'E') return 'E';
    if (t === 'TEACHER' || t === 'P') return 'P';
    if (t === 'COORDINATOR' || t === 'C') return 'C';
    return 'E';
  }

  private normalizeGender(gender: string): string {
    if (!gender) return 'M';
    const g = gender.toUpperCase();
    return (g === 'M' || g === 'F') ? g : 'M';
  }

  async getAllUsers(pagination?: { page: number; limit: number; all: boolean }) {
    try {
      const semester = await prisma.semester.findFirst({
        orderBy: { startDate: 'desc' },
      });
      const currentTerm = semester?.term;

      const page = pagination?.page ?? 1;
      const limit = pagination?.limit ?? 15;
      const all = pagination?.all ?? false;
      const offset = (page - 1) * limit;

      const totalRows = await prisma.$queryRaw`
        SELECT COUNT(*)::int as total
        FROM "User" u
        LEFT JOIN "Student" s ON u."identityCard" = s."identityCard" AND s."term" = ${currentTerm}
        LEFT JOIN "Teacher" t ON u."identityCard" = t."identityCard" AND t."term" = ${currentTerm}
        WHERE u."type" = 'C' 
           OR (u."type" = 'E' AND s."identityCard" IS NOT NULL)
           OR (u."type" = 'P' AND t."identityCard" IS NOT NULL)
      `;
      const total = Array.isArray(totalRows) ? Number(totalRows[0]?.total ?? 0) : 0;

      const users: any[] = all
        ? await prisma.$queryRaw`
          SELECT 
            u.*,
            u."fullName" AS "fullname",
            s.term AS "studentTerm", s.nrc AS "studentNrc", s.type AS "studentType",
            t.term AS "teacherTerm", t.type AS "teacherType"
          FROM "User" u
          LEFT JOIN "Student" s ON u."identityCard" = s."identityCard" AND s."term" = ${currentTerm}
          LEFT JOIN "Teacher" t ON u."identityCard" = t."identityCard" AND t."term" = ${currentTerm}
          WHERE u."type" = 'C' 
             OR (u."type" = 'E' AND s."identityCard" IS NOT NULL)
             OR (u."type" = 'P' AND t."identityCard" IS NOT NULL)
          ORDER BY u."identityCard" ASC
        `
        : await prisma.$queryRaw`
          SELECT 
            u.*,
            u."fullName" AS "fullname",
            s.term AS "studentTerm", s.nrc AS "studentNrc", s.type AS "studentType",
            t.term AS "teacherTerm", t.type AS "teacherType"
          FROM "User" u
          LEFT JOIN "Student" s ON u."identityCard" = s."identityCard" AND s."term" = ${currentTerm}
          LEFT JOIN "Teacher" t ON u."identityCard" = t."identityCard" AND t."term" = ${currentTerm}
          WHERE u."type" = 'C' 
             OR (u."type" = 'E' AND s."identityCard" IS NOT NULL)
             OR (u."type" = 'P' AND t."identityCard" IS NOT NULL)
          ORDER BY u."identityCard" ASC
          LIMIT ${limit} OFFSET ${offset}
        `;

      const totalPages = all ? 1 : Math.max(1, Math.ceil(total / limit));
      return {
        success: true,
        data: users,
        count: total,
        pagination: {
          page,
          limit: all ? total : limit,
          total,
          totalPages,
          all
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getUserById(id: string) {
    try {
      const foundUser = await prisma.user.findUnique({
        where: {
          identityCard: id
        },
        include: {
          students: {
            select: {
              term: true,
              nrc: true,
              type: true
            }
          },
          teachers: {
            select: {
              term: true,
              type: true
            }
          }
        }
      });

      if (!foundUser) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      const data = {
        ...foundUser,
        student: foundUser.students.length > 0 ? {
          term: foundUser.students[0].term,
          nrc: foundUser.students[0].nrc,
          type: foundUser.students[0].type
        } : null,
        teacher: foundUser.teachers.length > 0 ? {
          term: foundUser.teachers[0].term,
          type: foundUser.teachers[0].type
        } : null
      };

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createUser(data: any) {
    try {
      const existing = await prisma.$queryRaw`
        SELECT "identityCard" FROM "User" 
        WHERE "identityCard" = ${data.identityCard} OR "email" = ${data.email}
        LIMIT 1
      `;

      if (existing.length > 0) {
        return { success: false, message: 'Cedula o Email ya registrado' };
      }

      const type = this.normalizeType(data.type);
      const gender = this.normalizeGender(data.gender);
      const fullName = data.fullName ?? data.fullname ?? data.name;

      // Validate password
      const validation = PasswordUtil.validate(data.password);
      if (!validation.success) {
        return { success: false, message: validation.message };
      }

      // Hash password
      const hashedPass = await PasswordUtil.hash(data.password);

      // Map UserType explicitly for DB (Enum values are 'E', 'P', 'C')
      let userTypeDB = 'E';
      if (type === 'P' || type === 'TEACHER') userTypeDB = 'P';
      else if (type === 'C' || type === 'COORDINATOR') userTypeDB = 'C';
      else userTypeDB = 'E'; // Default Student

      // Get current term for Teacher record (needed if Coordinator)
      let currentTerm = '';
      if (userTypeDB === 'C') {
        const semester = await prisma.semester.findFirst({ orderBy: { startDate: 'desc' }, take: 1 });
        if (!semester) return { success: false, message: 'No hay semestres activos para registrar al coordinador como profesor.' };
        currentTerm = semester.term;
      }

      await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
          INSERT INTO "User" ("identityCard", "fullName", "email", "password", "isActive", "type", "gender")
          VALUES (${data.identityCard}, ${fullName}, ${data.email}, ${hashedPass}, ${data.isActive ?? true}, ${userTypeDB}::"UserType", ${gender}::"Gender")
        `;

        if (userTypeDB === 'C') {
          await tx.$executeRaw`
                INSERT INTO "Coordinator" ("identityCard")
                VALUES (${data.identityCard})
            `;

          // Also register as Teacher (Coordinator is always REGULAR)
          const teacherTypeDB = 'R';

          await tx.$executeRaw`
            INSERT INTO "Teacher" ("identityCard", "term", "type")
            VALUES (${data.identityCard}, ${currentTerm}, ${teacherTypeDB}::"TeacherType")
          `;
        }
      });

      return { success: true, message: 'Creado exitosamente' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateUser(id: string, data: any) {
    try {
      const fullName = data.fullName ?? data.fullname ?? data.name;

      let passwordToUpdate = data.password;
      if (passwordToUpdate) {
        const validation = PasswordUtil.validate(passwordToUpdate);
        if (!validation.success) {
          return { success: false, message: validation.message };
        }
        passwordToUpdate = await PasswordUtil.hash(passwordToUpdate);
      }

      await prisma.$executeRaw`
        UPDATE "User" SET
          "fullName" = COALESCE(${fullName}, "fullName"),
          "email" = COALESCE(${data.email}, "email"),
          "password" = COALESCE(${passwordToUpdate}, "password"),
          "isActive" = COALESCE(${data.isActive}, "isActive"),
          "gender" = COALESCE(${data.gender ? this.normalizeGender(data.gender) : null}, "gender"),
          "type" = COALESCE(${data.type ? this.normalizeType(data.type) : null}, "type")
        WHERE "identityCard" = ${id}
      `;
      return { success: true, message: 'Actualizado correctamente' };
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
