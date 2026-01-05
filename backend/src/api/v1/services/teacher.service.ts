import prisma from '#src/config/database.js';

class TeacherService {
  async getAllTeachers(term?: string) {
    try {
      let resolvedTerm = term;
      
      if (!resolvedTerm) {
        const termRows = await prisma.$queryRaw`
          SELECT MAX("term") as term
          FROM "Semester"
        ` as Array<{ term: string | null }>;
        
        resolvedTerm = termRows?.[0]?.term ?? undefined;
      }

      if (!resolvedTerm) {
        return { success: false, message: 'No se encontró un término válido' };
      }

      const teachers = await prisma.$queryRaw`
        SELECT
          u."identityCard",
          u."fullName",
          u."gender",
          u."email",
          u."isActive",
          u."type" AS "userType",
          t."term",
          t."type" AS "teacherType"
        FROM "Teacher" t
        JOIN "User" u ON t."identityCard" = u."identityCard"
        WHERE t."term" = ${resolvedTerm}
        ORDER BY u."fullName"
      `;

      return { success: true, data: teachers };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getTeacherById(identityCard: string, term?: string) {
    try {
      const termRows = term
        ? null
        : (await prisma.$queryRaw`
            SELECT MAX("term") as term
            FROM "Teacher"
            WHERE "identityCard" = ${identityCard}
          `) as Array<{ term: string | null }>;

      const resolvedTerm = term ?? termRows?.[0]?.term ?? undefined;

      if (!resolvedTerm) {
        return { success: false, message: 'Profesor no encontrado' };
      }

      const result = await prisma.$queryRaw`
        SELECT
          u."identityCard",
          u."fullName",
          u."fullName" AS "fullname",
          u."gender",
          u."email",
          u."password",
          u."isActive",
          u."type" AS "userType",
          t."term",
          t."type"
        FROM "Teacher" t
        JOIN "User" u ON t."identityCard" = u."identityCard"
        WHERE t."identityCard" = ${identityCard} AND t."term" = ${resolvedTerm}
      `;

      if (!Array.isArray(result) || result.length === 0) {
        return { success: false, message: 'Profesor no encontrado' };
      }

      return { success: true, data: result[0] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export default new TeacherService();
