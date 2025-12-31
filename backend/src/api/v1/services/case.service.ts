// @ts-nocheck
import { prisma } from '../../../config/database.js';

class CaseService {
  async getAllCases() {
    try {
      const cases = await prisma.$queryRaw`
        SELECT 
          c.*,
          b."fullName" as "applicantName",
          la."name" as "legalAreaName",
          u_teacher."fullName" as "teacherName",
          co."subject" as "courtName"

          FROM "Case" c
          JOIN "Beneficiary" b ON c."applicantId" = b."identityCard"
          JOIN "LegalArea" la ON c."idLegalArea" = la."idLegalArea"
          JOIN "User" u_teacher ON c."teacherId" = u_teacher."identityCard"
          LEFT JOIN "Court" co ON c."idCourt" = co."idCourt"

          ORDER BY c."createdAt" DESC;
      `;
      return { success: true, data: cases };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

    async getCaseById(id: number) {
      try {
        const caseData = await prisma.$queryRaw`
          SELECT 
            c.*,
            b."fullName" as "applicantName",
            la."name" as "legalAreaName",
            ct."subject" as "courtName",
            u."fullName" as "teacherName"
          FROM "Case" c
          JOIN "Applicant" a ON c."applicantId" = a."identityCard"
          JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
          JOIN "LegalArea" la ON c."idLegalArea" = la."idLegalArea"
          LEFT JOIN "Teacher" t ON c."teacherId" = t."identityCard" AND c."teacherTerm" = t."term"
          LEFT JOIN "User" u ON t."identityCard" = u."identityCard"
          LEFT JOIN "Court" ct ON c."idCourt" = ct."idCourt"
          WHERE c."idCase" = ${id}
        `;

        if (!Array.isArray(caseData) || caseData.length === 0) {
          return { success: false, message: 'Caso no encontrado' };
        }

        const statuses = await prisma.$queryRaw`
          SELECT * FROM "CaseStatus" WHERE "idCase" = ${id} ORDER BY "registryDate" DESC
        `;

        const students = await prisma.$queryRaw`
          SELECT s.*, u."fullName" 
          FROM "AssignedStudent" asg
          JOIN "Student" s ON asg."studentId" = s."identityCard" AND asg."term" = s."term"
          JOIN "User" u ON s."identityCard" = u."identityCard"
          WHERE asg."idCase" = ${id}
        `;

        return {
          success: true,
          data: { ...caseData[0], statuses, assignedStudents: students }
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }

  async createCase(data) {
    try {
      return await prisma.$transaction(async (tx) => {
        const newCase = await tx.$queryRaw`
          INSERT INTO "Case" 
          ("problemSummary", "processType", "applicantId", "idNucleus", "term", "idLegalArea", "teacherId", "teacherTerm", "idCourt")
          VALUES (
            ${data.problemSummary}, 
            ${data.processType}, 
            ${data.applicantId}, 
            ${data.idNucleus}, 
            ${data.term}, 
            ${data.idLegalArea}, 
            ${data.teacherId}, 
            ${data.teacherTerm || data.term}, 
            ${data.idCourt || null}
          )
          RETURNING *
        `;

        const createdCase = newCase[0];
        await tx.$executeRaw`
          INSERT INTO "CaseStatus" ("idCase", "statusNumber", "status", "reason", "userId", "registryDate")
          VALUES (${createdCase.idCase}, 1, 'A', 'Expediente Creado', ${data.userId}, NOW())
        `;
        return { success: true, data: createdCase };
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateCase(id, data) {
    try {
      const updatedCase = await prisma.$queryRaw`
        UPDATE "Case" SET 
          "problemSummary" = COALESCE(${data.problemSummary}, "problemSummary"),
          "processType" = COALESCE(${data.processType}, "processType"),
          "idLegalArea" = COALESCE(${data.idLegalArea}, "idLegalArea"),
          "idCourt" = ${data.idCourt !== undefined ? data.idCourt : "idCourt"},
          "teacherId" = COALESCE(${data.teacherId}, "teacherId")
        WHERE "idCase" = ${id}
        RETURNING *
      `;

      if (!updatedCase[0]) {
        return { success: false, message: 'Caso no encontrado' };
      }

      return { success: true, data: updatedCase[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async searchCases(term) {
    try {
      const searchTerm = `%${term}%`;
      const result = await prisma.$queryRaw`
        SELECT c."idCase", c."problemSummary", b."fullName" as "applicantName", b."identityCard" 
        FROM "Case" c
        JOIN "Beneficiary" b ON c."applicantId" = b."identityCard"
        WHERE b."fullName" ILIKE ${searchTerm} 
           OR c."applicantId" ILIKE ${searchTerm} 
           OR CAST(c."idCase" AS TEXT) ILIKE ${searchTerm}
        LIMIT 20
      `;
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteCase(id) {
    try {
      await prisma.$transaction(async (tx) => {
         await tx.$executeRaw`DELETE FROM "CaseStatus" WHERE "idCase" = ${id}`;
         await tx.$executeRaw`DELETE FROM "AssignedStudent" WHERE "idCase" = ${id}`;
         await tx.$executeRaw`DELETE FROM "Case" WHERE "idCase" = ${id}`;
      }); 
      return { success: true, message: 'Caso eliminado correctamente' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async changeCaseStatus(idCase, statusEnum, reason, userId) {
    try {
      const lastStatus = await prisma.$queryRaw`
        SELECT MAX("statusNumber") as max FROM "CaseStatus" WHERE "idCase" = ${idCase}
      `;
      const nextNumber = (Number(lastStatus[0].max) || 0) + 1;

      const newStatus = await prisma.$queryRaw`
        INSERT INTO "CaseStatus" ("idCase", "statusNumber", "status", "reason", "userId", "registryDate")
        VALUES (${idCase}, ${nextNumber}, ${statusEnum}, ${reason}, ${userId}, NOW())
        RETURNING *
      `;
      return { success: true, data: newStatus[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async assignStudentToCase(idCase, studentId, term) {
    try {
      const exists = await prisma.$queryRaw`
        SELECT * FROM "AssignedStudent" 
        WHERE "idCase" = ${idCase} AND "studentId" = ${studentId} AND "term" = ${term}
      `;

      if (Array.isArray(exists) && exists.length > 0) {
        return { success: false, message: 'El estudiante ya estÃ¡ asignado a este caso en este periodo' };
      }

      const assignment = await prisma.$queryRaw`
        INSERT INTO "AssignedStudent" ("idCase", "studentId", "term")
        VALUES (${idCase}, ${studentId}, ${term})
        RETURNING *
      `;
      return { success: true, data: assignment[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getActionsInfoFromCaseId(idCase) {
    try {
      const actions = await prisma.$queryRaw`
        SELECT 
          a.*, 
          u."fullName" as "userName"
        FROM "CaseAction" a
        JOIN "User" u ON a."userId" = u."identityCard"
        WHERE a."idCase" = ${idCase}
        ORDER BY a."registryDate" DESC
      `;
      return { success: true, data: actions };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async getBeneficiariesFromCaseId(idCase) {
    try {
      const beneficiaries = await prisma.$queryRaw`
        SELECT 
          cb."idCase",
          cb."relationship", 
          cb."type", 
          cb."description",
          b."identityCard",
          b."fullName",
          b."gender",
          b."birthDate",
          b."idNacionality",
          b."hasId"
        FROM "CaseBeneficiary" cb
        JOIN "Beneficiary" b ON cb."beneficiaryId" = b."identityCard"
        WHERE cb."idCase" = ${idCase}
      `;
      return { success: true, data: beneficiaries };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getStatusCaseAmount() {
    try {
      const result = await prisma.$queryRaw`
        WITH LatestStatuses AS (
          SELECT cs."idCase", cs."status"
          FROM "CaseStatus" cs
          WHERE cs."statusNumber" = (
            SELECT MAX(s2."statusNumber") 
            FROM "CaseStatus" s2 
            WHERE s2."idCase" = cs."idCase"
          )
        )
        SELECT 
          COUNT(*) FILTER (WHERE "status" = 'T') AS "proccessAmount",
          COUNT(*) FILTER (WHERE "status" = 'A') AS "adviceAmount",
          COUNT(*) FILTER (WHERE "status" = 'P') AS "mediationAmount",
          COUNT(*) FILTER (WHERE "status" = 'C') AS "draftingAmount"
        FROM LatestStatuses
      `;
      
      const data = result[0];
      return { 
        success: true, 
        data: {
          proccessAmount: Number(data.proccessAmount || 0),
          adviceAmount: Number(data.adviceAmount || 0),
          mediationAmount: Number(data.mediationAmount || 0),
          draftingAmount: Number(data.draftingAmount || 0)
        } 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCaseStatusFromCaseId(idCase) {
    try {
      const statuses = await prisma.$queryRaw`
        SELECT 
          "idCase",
          "statusNumber",
          "status",
          "reason",
          "userId",
          "registryDate"
        FROM "CaseStatus"
        WHERE "idCase" = ${idCase}
        ORDER BY "statusNumber" DESC
      `;

      return { success: true, data: statuses };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new CaseService();

