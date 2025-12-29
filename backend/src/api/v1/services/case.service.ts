// @ts-nocheck
import prisma from '../../../config/database.js';

class CaseService {

  async getAllCases() {
    try {
      const cases = await prisma.$queryRaw`
        SELECT 
          c."idCase",
          c."problemSummary",
          c."processType",
          c."createdAt",
          c."term",
          b."name" as "applicantName",
          b."identityCard" as "applicantId",
          la."description" as "legalArea",
          (
             SELECT s."description" 
             FROM "CaseStatus" s 
             WHERE s."idCase" = c."idCase" 
             ORDER BY s."date" DESC 
             LIMIT 1
          ) as "currentStatus"
        FROM "Case" c
        JOIN "Applicant" a ON c."applicantId" = a."identityCard"
        JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
        JOIN "LegalArea" la ON c."idLegalArea" = la."idLegalArea"
        ORDER BY c."createdAt" DESC
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
          b.name as "applicantName",
          b.gender as "applicantGender",
          la.description as "legalAreaName",
          n.name as "nucleusName",
          ct.name as "courtName",
          t_user.name as "teacherName"
        FROM "Case" c
        JOIN "Applicant" a ON c."applicantId" = a."identityCard"
        JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
        JOIN "LegalArea" la ON c."idLegalArea" = la."idLegalArea"
        JOIN "Nucleus" n ON c."idNucleus" = n."idNucleus"
        LEFT JOIN "Teacher" t ON c."teacherId" = t."identityCard" AND c."teacherTerm" = t."term"
        LEFT JOIN "User" t_user ON t."identityCard" = t_user."identityCard"
        LEFT JOIN "Court" ct ON c."idCourt" = ct."idCourt"
        WHERE c."idCase" = ${id}
      `;

      if (!Array.isArray(caseData) || caseData.length === 0) {
        return { success: false, message: 'Caso no encontrado' };
      }

      const foundCase = caseData[0];

      const statuses = await prisma.$queryRaw`
        SELECT * FROM "CaseStatus" WHERE "idCase" = ${id} ORDER BY "date" DESC
      `;

      const students = await prisma.$queryRaw`
        SELECT s.*, u.name 
        FROM "AssignedStudent" asg
        JOIN "Student" s ON asg."studentId" = s."identityCard"
        JOIN "User" u ON s."identityCard" = u."identityCard"
        WHERE asg."idCase" = ${id}
      `;

      return {
        success: true,
        data: {
          ...foundCase,
          statuses,
          assignedStudents: students
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createCase(data: any) {
    try {
      return await prisma.$transaction(async (tx) => {
        const newCase = await tx.$queryRaw`
          INSERT INTO "Case" 
          (
            "problemSummary", 
            "processType", 
            "applicantId", 
            "idNucleus", 
            "term", 
            "idLegalArea", 
            "teacherId", 
            "teacherTerm", 
            "idCourt"
          )
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
           INSERT INTO "CaseStatus" ("idCase", "description", "date")
           VALUES (${createdCase.idCase}, 'Expediente Creado', NOW())
        `;

        return { success: true, data: createdCase };
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateCase(id: number, data: any) {
    try {
      const updatedCase = await prisma.$queryRaw`
        UPDATE "Case" SET 
          "problemSummary" = COALESCE(${data.problemSummary}, "problemSummary"),
          "processType" = COALESCE(${data.processType}, "processType"),
          "idLegalArea" = COALESCE(${data.idLegalArea}, "idLegalArea"),
          "idCourt" = COALESCE(${data.idCourt}, "idCourt"),
          "teacherId" = COALESCE(${data.teacherId}, "teacherId")
        WHERE "idCase" = ${id}
        RETURNING *
      `;

      if (!updatedCase[0]) return { success: false, message: 'Caso no encontrado' };

      return { success: true, data: updatedCase[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async searchCases(term: string) {
    try {
      const searchTerm = `%${term}%`;
      const result = await prisma.$queryRaw`
        SELECT 
          c."idCase", 
          c."problemSummary", 
          b."name" as "applicantName", 
          b."identityCard" 
        FROM "Case" c
        JOIN "Applicant" a ON c."applicantId" = a."identityCard"
        JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
        WHERE 
          b."name" ILIKE ${searchTerm} OR 
          c."applicantId" ILIKE ${searchTerm} OR
          CAST(c."idCase" AS TEXT) ILIKE ${searchTerm}
        LIMIT 20
      `;
      
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteCase(id: number) {
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

  async changeCaseStatus(idCase: number, description: string, date?: string) {
    try {
      const statusDate = date ? new Date(date) : new Date();
      
      const newStatus = await prisma.$queryRaw`
        INSERT INTO "CaseStatus" ("idCase", "description", "date")
        VALUES (${idCase}, ${description}, ${statusDate})
        RETURNING *
      `;
      return { success: true, data: newStatus[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCaseTimeline(idCase: number) {
    try {
      const timeline = await prisma.$queryRaw`
        SELECT * FROM "CaseStatus" 
        WHERE "idCase" = ${idCase} 
        ORDER BY "date" DESC
      `;
      return { success: true, data: timeline };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async assignStudentToCase(idCase: number, studentId: string) {
    try {
      const exists = await prisma.$queryRaw`
        SELECT * FROM "AssignedStudent" 
        WHERE "idCase" = ${idCase} AND "studentId" = ${studentId}
      `;

      if (Array.isArray(exists) && exists.length > 0) {
        return { success: false, message: 'El estudiante ya está asignado a este caso' };
      }

      const assignment = await prisma.$queryRaw`
        INSERT INTO "AssignedStudent" ("idCase", "studentId", "isActive")
        VALUES (${idCase}, ${studentId}, true)
        RETURNING *
      `;
      return { success: true, data: assignment[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAssignedStudents(idCase: number) {
    try {
      const students = await prisma.$queryRaw`
        SELECT a.*, u.name as "studentName", u.email
        FROM "AssignedStudent" a
        JOIN "Student" s ON a."studentId" = s."identityCard"
        JOIN "User" u ON s."identityCard" = u."identityCard"
        WHERE a."idCase" = ${idCase}
      `;
      return { success: true, data: students };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new CaseService();