import prisma from '#src/config/database.js';

class StudentService {
  async getAllStudents(term?: string) {
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

      const students = await prisma.$queryRaw`
        SELECT
          u."identityCard",
          u."fullName",
          u."gender",
          u."email",
          u."isActive",
          u."type" AS "userType",
          s."term",
          s."nrc",
          s."type" AS "studentType"
        FROM "Student" s
        JOIN "User" u ON s."identityCard" = u."identityCard"
        WHERE s."term" = ${resolvedTerm}
        ORDER BY u."fullName"
      `;

      return { success: true, data: students };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getStudentById(identityCard: string, term?: string) {
    try {
      const termRows = term
        ? null
        : (await prisma.$queryRaw`
            SELECT MAX("term") as term
            FROM "Student"
            WHERE "identityCard" = ${identityCard}
          `) as Array<{ term: string | null }>;

      const resolvedTerm = term ?? termRows?.[0]?.term ?? undefined;

      if (!resolvedTerm) {
        return { success: false, message: 'Estudiante no encontrado' };
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
          s."term",
          s."nrc",
          s."type"
        FROM "Student" s
        JOIN "User" u ON s."identityCard" = u."identityCard"
        WHERE s."identityCard" = ${identityCard} AND s."term" = ${resolvedTerm}
      `;

      if (!Array.isArray(result) || result.length === 0) {
        return { success: false, message: 'Estudiante no encontrado' };
      }

      return { success: true, data: result[0] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export default new StudentService();
