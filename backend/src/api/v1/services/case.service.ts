// @ts-nocheck
import prisma from '#src/config/database.js';

class CaseService {
  async getAllCases() {
    try {
      const cases = await prisma.$queryRaw`
        SELECT 
          c.*,
          b."fullName" as "applicantName",
          la."name" as "legalAreaName",
          u_teacher."fullName" as "teacherName",
          co."subject" as "courtName",
          cs."status" as "caseStatus",
          ca."registryDate" as "lastActionDate",
          ca."description" as "lastActionDescription",
          (c."idNucleus" || '_' || c."term" || '_' || c."idCase") as "compoundKey"

          FROM "Case" c
          JOIN "Beneficiary" b ON c."applicantId" = b."identityCard"
          JOIN "LegalArea" la ON c."idLegalArea" = la."idLegalArea"
          LEFT JOIN "User" u_teacher ON c."teacherId" = u_teacher."identityCard"
          LEFT JOIN "Court" co ON c."idCourt" = co."idCourt"
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
          s."name" as "subjectName",
          sc."name" as "subjectCategoryName",
          ct."subject" as "courtName",
          u."fullName" as "teacherName",
          cs."status" as "caseStatus",
          ca."registryDate" as "lastActionDate",
          ca."description" as "lastActionDescription",
          (c."idNucleus" || '_' || c."term" || '_' || c."idCase") as "compoundKey"
        FROM "Case" c
        JOIN "Applicant" a ON c."applicantId" = a."identityCard"
        JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
        JOIN "LegalArea" la ON c."idLegalArea" = la."idLegalArea"
        JOIN "SubjectCategory" sc ON la."idSubject" = sc."idSubject" AND la."categoryNumber" = sc."categoryNumber"
        JOIN "Subject" s ON sc."idSubject" = s."idSubject"
        LEFT JOIN "Teacher" t ON c."teacherId" = t."identityCard" AND c."teacherTerm" = t."term"
        LEFT JOIN "User" u ON t."identityCard" = u."identityCard"
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
        // Obtener el último semestre
        const lastSemester = await tx.$queryRaw`
          SELECT "term" FROM "Semester" ORDER BY "startDate" DESC LIMIT 1
        `;

        if (!lastSemester || lastSemester.length === 0) {
          throw new Error("No se encontraron semestres registrados");
        }

        const currentTerm = lastSemester[0].term;

        const newCase = await tx.$queryRaw`
          INSERT INTO "Case" 
          ("problemSummary", "processType", "applicantId", "idNucleus", "term", "idLegalArea", "teacherId", "teacherTerm", "idCourt")
          VALUES (
            ${data.problemSummary}, 
            ${data.processType}, 
            ${data.applicantId}, 
            ${data.idNucleus}, 
            ${currentTerm}, 
            ${data.idLegalArea}, 
            ${data.teacherId}, 
            ${data.teacherTerm || currentTerm}, 
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

      if (lastStatus[0].status === statusEnum) {
        return { success: true, data: null, message: 'El estado es el mismo que el actual' };
      }

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
          u."fullName" as "userName",
          (c."idNucleus" || '_' || c."term" || '_' || c."idCase") as "compoundKey"
        FROM "CaseAction" a
        JOIN "User" u ON a."userId" = u."identityCard"
        JOIN "Case" c ON a."idCase" = c."idCase"
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
          b."idNationality",
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
          COUNT(*) FILTER (WHERE "status" = 'T') AS "inProgressAmount",
          COUNT(*) FILTER (WHERE "status" = 'A') AS "openAmount",
          COUNT(*) FILTER (WHERE "status" = 'P') AS "pausedAmount",
          COUNT(*) FILTER (WHERE "status" = 'C') AS "closedAmount"
        FROM LatestStatuses
      `;

      const data = result[0];
      return {
        success: true,
        data: {
          inProgressAmount: Number(data.inProgressAmount || 0),
          openAmount: Number(data.openAmount || 0),
          pausedAmount: Number(data.pausedAmount || 0),
          closedAmount: Number(data.closedAmount || 0)
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

  async getStudentsFromCaseId(caseId) {
    try {
      const id = typeof caseId === 'string' ? parseInt(caseId) : caseId;

      const students = await prisma.$queryRaw`
        SELECT 
          s."identityCard",
          s."term",
          s."nrc",
          s."type",
          u."fullName",
          u."email"
        FROM "AssignedStudent" asg
        JOIN "Student" s ON asg."studentId" = s."identityCard" AND asg."term" = s."term"
        JOIN "User" u ON s."identityCard" = u."identityCard"
        WHERE asg."idCase" = ${id}
        ORDER BY u."fullName"
      `;

      return { success: true, data: students };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createStatusForCaseId(caseId, data) {
    try {
      const id = typeof caseId === 'string' ? parseInt(caseId) : caseId;

      const caseExists = await prisma.$queryRaw`
        SELECT "idCase" FROM "Case" WHERE "idCase" = ${id}
      `;

      if (!Array.isArray(caseExists) || caseExists.length === 0) {
        return { success: false, message: 'Caso no encontrado' };
      }

      if (!data.status || !data.userId) {
        return { success: false, message: 'status y userId son obligatorios' };
      }

      const lastStatus = await prisma.$queryRaw`
        SELECT MAX("statusNumber") as max FROM "CaseStatus" WHERE "idCase" = ${id}
      `;
      const nextNumber = (Number(lastStatus[0]?.max) || 0) + 1;

      const newStatus = await prisma.$queryRaw`
        INSERT INTO "CaseStatus" ("idCase", "statusNumber", "status", "reason", "userId", "registryDate")
        VALUES (${id}, ${nextNumber}, ${data.status}, ${data.reason || null}, ${data.userId}, NOW())
        RETURNING *
      `;

      return { success: true, data: newStatus[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAppoitmentByCaseId(caseId) {
    try {
      const id = typeof caseId === 'string' ? parseInt(caseId) : caseId;

      const appointments = await prisma.$queryRaw`
        SELECT 
          a."idCase",
          a."appointmentNumber",
          a."plannedDate",
          a."executionDate",
          a."status",
          a."guidance",
          a."registryDate",
          u."fullName" as "userName",
          u."email" as "userEmail",
          (c."idNucleus" || '_' || c."term" || '_' || c."idCase") as "compoundKey"
        FROM "Appointment" a
        JOIN "User" u ON a."userId" = u."identityCard"
        JOIN "Case" c ON a."idCase" = c."idCase"
        WHERE a."idCase" = ${id}
        ORDER BY a."plannedDate" DESC
      `;

      return { success: true, data: appointments };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createAppoitmentForCaseId(caseId, data) {
    try {
      const id = typeof caseId === 'string' ? parseInt(caseId) : caseId;

      const caseExists = await prisma.$queryRaw`
        SELECT "idCase" FROM "Case" WHERE "idCase" = ${id}
      `;

      if (!Array.isArray(caseExists) || caseExists.length === 0) {
        return { success: false, message: 'Caso no encontrado' };
      }

      if (!data.plannedDate || !data.userId) {
        return { success: false, message: 'plannedDate y userId son obligatorios' };
      }

      const lastAppointment = await prisma.$queryRaw`
        SELECT MAX("appointmentNumber") as max FROM "Appointment" WHERE "idCase" = ${id}
      `;
      const nextNumber = (Number(lastAppointment[0]?.max) || 0) + 1;

      const newAppointment = await prisma.$queryRaw`
        INSERT INTO "Appointment" ("idCase", "appointmentNumber", "plannedDate", "executionDate", "status", "guidance", "userId", "registryDate")
        VALUES (${id}, ${nextNumber}, ${data.plannedDate}, ${data.executionDate || null}, ${data.status || 'P'}, ${data.guidance || null}, ${data.userId}, NOW())
        RETURNING *
      `;

      return { success: true, data: newAppointment[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getSupportDocumentsById(caseId) {
    try {
      const id = typeof caseId === 'string' ? parseInt(caseId) : caseId;

      const documents = await prisma.$queryRaw`
        SELECT 
          sd."idCase",
          sd."supportNumber",
          sd."title",
          sd."description",
          sd."submissionDate",
          sd."fileUrl",
          (c."idNucleus" || '_' || c."term" || '_' || c."idCase") as "compoundKey"
        FROM "SupportDocument" sd
        JOIN "Case" c ON sd."idCase" = c."idCase"
        WHERE sd."idCase" = ${id}
        ORDER BY sd."submissionDate" DESC
      `;

      return { success: true, data: documents };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createSupportDocumentForCaseId(caseId, data) {
    try {
      const id = typeof caseId === 'string' ? parseInt(caseId) : caseId;

      const caseExists = await prisma.$queryRaw`
        SELECT "idCase" FROM "Case" WHERE "idCase" = ${id}
      `;

      if (!Array.isArray(caseExists) || caseExists.length === 0) {
        return { success: false, message: 'Caso no encontrado' };
      }

      if (!data.title || !data.description) {
        return { success: false, message: 'title y description son obligatorios' };
      }

      const lastDocument = await prisma.$queryRaw`
        SELECT MAX("supportNumber") as max FROM "SupportDocument" WHERE "idCase" = ${id}
      `;
      const nextNumber = (Number(lastDocument[0]?.max) || 0) + 1;

      const newDocument = await prisma.$queryRaw`
        INSERT INTO "SupportDocument" ("idCase", "supportNumber", "title", "description", "submissionDate", "fileUrl")
        VALUES (${id}, ${nextNumber}, ${data.title}, ${data.description}, ${data.submissionDate || NOW()}, ${data.fileUrl || null})
        RETURNING *
      `;

      return { success: true, data: newDocument[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async addBeneficiaryToCase(idCase, beneficiaryData) {
    try {
      const caseExists = await prisma.$queryRaw`
        SELECT "idCase" FROM "Case" WHERE "idCase" = ${idCase}
      `;

      if (!Array.isArray(caseExists) || caseExists.length === 0) {
        return { success: false, message: 'Caso no encontrado' };
      }

      const beneficiaryExists = await prisma.$queryRaw`
        SELECT "identityCard" FROM "Beneficiary" WHERE "identityCard" = ${beneficiaryData.beneficiaryId}
      `;

      if (!Array.isArray(beneficiaryExists) || beneficiaryExists.length === 0) {
        return { success: false, message: 'Beneficiario no encontrado' };
      }

      const exists = await prisma.$queryRaw`
        SELECT * FROM "CaseBeneficiary" 
        WHERE "idCase" = ${idCase} AND "beneficiaryId" = ${beneficiaryData.beneficiaryId}
      `;

      if (Array.isArray(exists) && exists.length > 0) {
        return { success: false, message: 'El beneficiario ya está asignado a este caso' };
      }

      const assignment = await prisma.$queryRaw`
        INSERT INTO "CaseBeneficiary" 
        ("idCase", "beneficiaryId", "relationship", "type", "description")
        VALUES (
          ${idCase}, 
          ${beneficiaryData.beneficiaryId}, 
          ${beneficiaryData.relationship}, 
          ${beneficiaryData.type}, 
          ${beneficiaryData.description}
        )
        RETURNING *
      `;

      return { success: true, data: assignment[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async addStudentToCase(idCase, studentData) {
    try {
      const caseExists = await prisma.$queryRaw`
        SELECT "idCase" FROM "Case" WHERE "idCase" = ${idCase}
      `;

      if (!Array.isArray(caseExists) || caseExists.length === 0) {
        return { success: false, message: 'Caso no encontrado' };
      }

      const actualTerm = (await prisma.$queryRaw`
        SELECT "term" FROM "Semester" ORDER BY "startDate" DESC LIMIT 1
      `)[0]?.term;

      const studentExists = await prisma.$queryRaw`
        SELECT "identityCard", "term" FROM "Student" 
        WHERE "identityCard" = ${studentData.studentId} AND "term" = ${actualTerm}
      `;

      if (!Array.isArray(studentExists) || studentExists.length === 0) {
        return { success: true, message: 'Estudiante no encontrado en el término especificado' };
      }

      const exists = await prisma.$queryRaw`
        SELECT * FROM "AssignedStudent" 
        WHERE "idCase" = ${idCase} AND "studentId" = ${studentData.studentId} AND "term" = ${actualTerm}
      `;

      if (Array.isArray(exists) && exists.length > 0) {
        return { success: true, message: 'El estudiante ya está asignado a este caso en este periodo' };
      }

      const assignment = await prisma.$queryRaw`
        INSERT INTO "AssignedStudent" ("idCase", "studentId", "term")
        VALUES (${idCase}, ${studentData.studentId}, ${actualTerm})
        RETURNING *
      `;

      return { success: true, data: assignment[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async removeBeneficiaryFromCase(idCase, beneficiaryId) {
    try {
      const exists = await prisma.$queryRaw`
        SELECT * FROM "CaseBeneficiary" 
        WHERE "idCase" = ${idCase} AND "beneficiaryId" = ${beneficiaryId}
      `;

      if (!Array.isArray(exists) || exists.length === 0) {
        return { success: true, message: 'El beneficiario no está asignado a este caso' };
      }

      await prisma.$queryRaw`
        DELETE FROM "CaseBeneficiary" 
        WHERE "idCase" = ${idCase} AND "beneficiaryId" = ${beneficiaryId}
      `;

      return { success: true, message: 'Beneficiario removido del caso correctamente' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async removeStudentFromCase(idCase: number, studentId: string) {
    try {
      const actualTerm = (await prisma.$queryRaw`
        SELECT "term" FROM "Semester" ORDER BY "startDate" DESC LIMIT 1
      `)[0]?.term;

      const exists = await prisma.$queryRaw`
        SELECT * FROM "AssignedStudent" 
        WHERE "idCase" = ${idCase} AND "studentId" = ${studentId} AND "term" = ${actualTerm}
      `;

      if (!Array.isArray(exists) || exists.length === 0) {
        return { success: true, message: 'El estudiante no está asignado a este caso' };
      }


      await prisma.$queryRaw`
        DELETE FROM "AssignedStudent" 
        WHERE "idCase" = ${idCase} AND "studentId" = ${studentId} AND "term" = ${actualTerm}
      `;

      return { success: true, message: 'Estudiante removido del caso correctamente' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

}

export default new CaseService();