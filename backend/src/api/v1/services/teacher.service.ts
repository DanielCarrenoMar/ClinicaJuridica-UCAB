import prisma from '#src/config/database.js';
import userService from './user.service.js';
import { PasswordUtil } from '../utils/password.util.js';

class TeacherService {
  async getAllTeachers(term?: string, pagination?: { page: number; limit: number; all: boolean }) {
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

      const page = pagination?.page ?? 1;
      const limit = pagination?.limit ?? 15;
      const all = pagination?.all ?? false;
      const offset = (page - 1) * limit;

      const totalRows = await prisma.$queryRaw`
        SELECT COUNT(*)::int as total
        FROM "Teacher" t
        WHERE t."term" = ${resolvedTerm}
      `;
      const total = Array.isArray(totalRows) ? Number(totalRows[0]?.total ?? 0) : 0;

      const teachers = all
        ? await prisma.$queryRaw`
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
        `
        : await prisma.$queryRaw`
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
          LIMIT ${limit} OFFSET ${offset}
        `;

      const totalPages = all ? 1 : Math.max(1, Math.ceil(total / limit));
      return {
        success: true,
        data: teachers,
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

  async getCasesByTeacherId(identityCard: string) {
    try {
      const userRows = (await prisma.$queryRaw`
        SELECT 1 as "ok" FROM "User" WHERE "identityCard" = ${identityCard} LIMIT 1
      `) as Array<{ ok: number }>;

      if (!Array.isArray(userRows) || userRows.length === 0) {
        return { success: false, message: 'Profesor no encontrado' };
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
        FROM "Case" c
        JOIN "Applicant" a ON c."applicantId" = a."identityCard"
        JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
        JOIN "LegalArea" la ON c."idLegalArea" = la."idLegalArea"
        JOIN "SubjectCategory" sc ON la."idSubject" = sc."idSubject" AND la."categoryNumber" = sc."categoryNumber"
        JOIN "Subject" s ON sc."idSubject" = s."idSubject"
        LEFT JOIN "User" u_teacher ON c."teacherId" = u_teacher."identityCard"
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
        WHERE c."teacherId" = ${identityCard}
          AND c."teacherTerm" = ${lastTerm}
        ORDER BY c."createdAt" DESC
      `;

      return { success: true, data: cases };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateTeacher(id: string, data: any) {
    try {
      const userUpdate = await userService.updateUser(id, { ...data, type: 'P' });
      if (!userUpdate.success) {
        return userUpdate;
      }

      let term = data.term || data.teacherTerm;
      if (!term) {
        const rows: any[] = await prisma.$queryRaw`
          SELECT term FROM "Teacher" 
          WHERE "identityCard" = ${id} 
          ORDER BY "term" DESC LIMIT 1
        `;
        if (rows.length > 0) {
          term = rows[0].term;
        }
      }

      if (term) {
        await prisma.$executeRaw`
          UPDATE "Teacher" SET
            "type" = COALESCE(${data.type}::"TeacherType", "type")
          WHERE "identityCard" = ${id} AND "term" = ${term}
        `;
      }

      return { success: true, message: 'Profesor actualizado correctamente' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createTeacher(data: any) {
    try {
      const semester = await prisma.semester.findFirst({ orderBy: { startDate: 'desc' }, take: 1 });
      if (!semester) return { success: false, message: 'No hay semestres activos' };
      const currentTerm = semester.term;

      const userExists = await prisma.user.findUnique({ where: { identityCard: data.identityCard } });
      if (userExists) return { success: false, message: 'El usuario ya existe' };

      const hashedPassword = await PasswordUtil.hash(data.password);
      const gender = data.gender === 'F' ? 'F' : (data.gender === 'M' ? 'M' : null);

      // Map TeacherType to DB Enum values
      let teacherTypeDB = 'R'; // Default REGULAR -> R
      if (data.type === 'VOLUNTEER' || data.type === 'V') teacherTypeDB = 'V';
      else if (data.type === 'REGULAR' || data.type === 'R') teacherTypeDB = 'R';

      await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
            INSERT INTO "User" ("identityCard", "fullName", "email", "password", "type", "gender", "isActive")
            VALUES (
                ${data.identityCard},
                ${data.fullName},
                ${data.email},
                ${hashedPassword},
                'P'::"UserType",
                ${gender}::"Gender",
                true
            )
          `;

        await tx.$executeRaw`
            INSERT INTO "Teacher" ("identityCard", "term", "type")
            VALUES (
                ${data.identityCard},
                ${currentTerm},
                ${teacherTypeDB}::"TeacherType"
            )
          `;
      });
      return { success: true, message: 'Profesor creado exitosamente' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export default new TeacherService();
