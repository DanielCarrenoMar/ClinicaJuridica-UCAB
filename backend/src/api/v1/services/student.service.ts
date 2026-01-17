import prisma from '#src/config/database.js';
import userService from './user.service.js';
import { PasswordUtil } from '../utils/password.util.js';

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
      const userUpdate = await userService.updateUser(id, { ...data, type: 'E' });
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

  async importStudents(studentsData: any[]) {
    const results = {
      total: studentsData.length,
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    if (studentsData.length === 0) {
      return { success: false, message: 'No hay datos para importar.' };
    }

    try {
      // 1. Get the latest semester from the database
      const latestSemesterRows = await prisma.$queryRaw`
        SELECT "term" FROM "Semester" ORDER BY "startDate" DESC LIMIT 1
      ` as any[];

      if (!latestSemesterRows || latestSemesterRows.length === 0) {
        return {
          success: false,
          message: 'No hay semestres registrados en el sistema. Por favor, registre el semestre actual antes de importar estudiantes.'
        };
      }

      const latestTerm = latestSemesterRows[0].term;

      // 2. Validate the term in the data against the latest semester
      // We assume all students in the import belong to the same term
      const dataTermRaw = studentsData[0].term || '';
      const dataTermNormalized = dataTermRaw.replace(/\s+/g, ''); // Normalize "2025 - 2026" to "2025-2026"

      if (dataTermNormalized !== latestTerm.replace(/\s+/g, '')) {
        return {
          success: false,
          message: `El semestre del archivo (${dataTermRaw}) no coincide con el semestre actual del sistema (${latestTerm}). Por favor, registre el nuevo semestre o verifique el archivo.`
        };
      }

      // 3. Process students
      for (const data of studentsData) {
        try {
          await prisma.$transaction(async (tx) => {
            // Upsert User
            const defaultPass = await PasswordUtil.hash(data.identityCard);
            const gender = data.gender === 'F' ? 'F' : 'M';

            await tx.$executeRaw`
              INSERT INTO "User" ("identityCard", "fullName", "email", "password", "type", "gender", "isActive")
              VALUES (
                ${data.identityCard},
                ${data.fullName},
                ${data.email},
                ${defaultPass},
                'E'::"UserType",
                ${gender}::"Gender",
                true
              )
              ON CONFLICT ("identityCard") DO UPDATE SET
                "fullName" = EXCLUDED."fullName",
                "email" = EXCLUDED."email",
                "gender" = EXCLUDED."gender"
            `;

            // Upsert Student record for this term
            const studentType = (data.type?.startsWith('R') ? 'R' :
              data.type?.startsWith('V') ? 'V' :
                data.type?.startsWith('E') ? 'E' :
                  data.type?.startsWith('S') ? 'S' : 'R');

            await tx.$executeRaw`
              INSERT INTO "Student" ("identityCard", "term", "nrc", "type")
              VALUES (
                ${data.identityCard},
                ${latestTerm}, -- Use the confirmed latest term from DB
                ${data.nrc},
                ${studentType}::"StudentType"
              )
              ON CONFLICT ("identityCard", "term") DO UPDATE SET
                "nrc" = EXCLUDED."nrc",
                "type" = EXCLUDED."type"
            `;
          });
          results.success++;
        } catch (error: any) {
          results.failed++;
          results.errors.push(`ID ${data.identityCard}: ${error.message}`);
        }
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }

    return {
      success: results.failed === 0,
      data: results,
      message: results.failed === 0
        ? 'Todos los estudiantes fueron importados correctamente.'
        : `Se importaron ${results.success} estudiantes, pero ${results.failed} fallaron.`
    };
  }
}

export default new StudentService();
