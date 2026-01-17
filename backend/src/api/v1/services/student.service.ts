import prisma from '#src/config/database.js';
import userService from './user.service.js';

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

  async getCasesByStudentId(identityCard: string) {
    try {
      const userRows = (await prisma.$queryRaw`
        SELECT 1 as "ok" FROM "User" WHERE "identityCard" = ${identityCard} LIMIT 1
      `) as Array<{ ok: number }>;

      if (!Array.isArray(userRows) || userRows.length === 0) {
        return { success: false, message: 'Estudiante no encontrado' };
      }

      const lastTerm = (await prisma.$queryRaw`
        SELECT MAX("term") as term
        FROM "Semester"
      ` as Array<{ term: string | null }>)?.[0]?.term;

      const cases = await prisma.$queryRaw`
        SELECT
          c."idCase",
          c."problemSummary",
          c."createdAt",
          c."processType",
          c."applicantId",
          c."idNucleus",
          c."term",
          c."idLegalArea",
          c."teacherId",
          c."teacherTerm",
          c."idCourt",
          b."fullName" as "applicantName",
          la."name" as "legalAreaName",
          COALESCE(u_teacher."fullName", '') as "teacherName",
          ct."subject" as "courtName",
          cs."status" as "caseStatus",
          ca."registryDate" as "lastActionDate",
          ca."description" as "lastActionDescription",
          s."name" as "subjectName",
          sc."name" as "subjectCategoryName",
          (c."idNucleus" || '_' || c."term" || '_' || c."idCase") as "compoundKey"
        FROM "AssignedStudent" asg
        JOIN "Case" c ON c."idCase" = asg."idCase"
        JOIN "Applicant" a ON c."applicantId" = a."identityCard"
        JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
        JOIN "LegalArea" la ON c."idLegalArea" = la."idLegalArea"
        JOIN "SubjectCategory" sc ON la."idSubject" = sc."idSubject" AND la."categoryNumber" = sc."categoryNumber"
        JOIN "Subject" s ON sc."idSubject" = s."idSubject"
        LEFT JOIN "Teacher" t ON c."teacherId" = t."identityCard" AND c."teacherTerm" = t."term"
        LEFT JOIN "User" u_teacher ON t."identityCard" = u_teacher."identityCard"
        LEFT JOIN "Court" ct ON c."idCourt" = ct."idCourt"
        LEFT JOIN LATERAL (
          SELECT cs1."status"
          FROM "CaseStatus" cs1
          WHERE cs1."idCase" = c."idCase"
          ORDER BY cs1."statusNumber" DESC
          LIMIT 1
        ) cs ON TRUE
        LEFT JOIN LATERAL (
          SELECT ca1."registryDate", ca1."description"
          FROM "CaseAction" ca1
          WHERE ca1."idCase" = c."idCase"
          ORDER BY ca1."registryDate" DESC
          LIMIT 1
        ) ca ON TRUE
        WHERE asg."studentId" = ${identityCard}
          AND asg."term" = ${lastTerm}
        ORDER BY c."createdAt" DESC
      `;

      return { success: true, data: cases };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateStudent(id: string, data: any) {
    try {
      const userUpdate = await userService.updateUser(id, {...data, type: 'E' });
      if (!userUpdate.success) {
        return userUpdate;
      }

      let term = data.term || data.studentTerm;
      if (!term) {
        const rows: any[] = await prisma.$queryRaw`
          SELECT term FROM "Student" 
          WHERE "identityCard" = ${id} 
          ORDER BY "term" DESC LIMIT 1
        `;
        if (rows.length > 0) {
          term = rows[0].term;
        }
      }

      if (term) { 
        await prisma.$executeRaw`
          UPDATE "Student" SET
            "nrc" = COALESCE(${data.nrc}, "nrc"),
            "type" = COALESCE(${data.type}::"StudentType", "type")
          WHERE "identityCard" = ${id} AND "term" = ${term}
        `;
      }

      return { success: true, message: 'Estudiante actualizado correctamente' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export default new StudentService();
