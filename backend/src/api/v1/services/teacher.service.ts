import { prisma } from '../../../config/database.js';

class TeacherService {
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
