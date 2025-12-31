// @ts-nocheck
import { prisma } from "../../../config/database.js";

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

  async getAllUsers() {
    try {
      const users = await prisma.$queryRaw`
        SELECT 
          u.*,
          s.term AS "studentTerm", s.nrc AS "studentNrc", s.type AS "studentType",
          t.term AS "teacherTerm", t.type AS "teacherType"
        FROM "User" u
        LEFT JOIN "Student" s ON u."identityCard" = s."identityCard"
        LEFT JOIN "Teacher" t ON u."identityCard" = t."identityCard"
        ORDER BY u."identityCard" ASC
      `;
      return { success: true, data: users, count: users.length };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getUserById(id: string) {
    try {
      const result = await prisma.$queryRaw`
        SELECT 
          u.*,
          s.term AS "studentTerm", s.nrc AS "studentNrc", s.type AS "studentType",
          t.term AS "teacherTerm", t.type AS "teacherType"
        FROM "User" u
        LEFT JOIN "Student" s ON u."identityCard" = s."identityCard"
        LEFT JOIN "Teacher" t ON u."identityCard" = t."identityCard"
        WHERE u."identityCard" = ${id}
      `;

      if (!Array.isArray(result) || result.length === 0) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      const user = result[0];
      const data = {
        ...user,
        student: user.studentTerm ? { 
          term: user.studentTerm, 
          nrc: user.studentNrc, 
          type: user.studentType 
        } : null,
        teacher: user.teacherTerm ? { 
          term: user.teacherTerm, 
          type: user.teacherType 
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
        return { success: false, message: 'CÃ©dula o Email ya registrado' };
      }

      const type = this.normalizeType(data.type);
      const gender = this.normalizeGender(data.gender);

      await prisma.$executeRaw`
        INSERT INTO "User" ("identityCard", "name", "email", "password", "isActive", "type", "gender")
        VALUES (${data.identityCard}, ${data.name}, ${data.email}, ${data.password}, ${data.isActive ?? true}, ${type}, ${gender})
      `;

      return { success: true, message: 'Creado exitosamente' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateUser(id: string, data: any) {
    try {
      await prisma.$executeRaw`
        UPDATE "User" SET
          "name" = COALESCE(${data.name}, "name"),
          "email" = COALESCE(${data.email}, "email"),
          "password" = COALESCE(${data.password}, "password"),
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
