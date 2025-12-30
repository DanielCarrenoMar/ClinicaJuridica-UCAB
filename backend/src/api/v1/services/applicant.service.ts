// @ts-nocheck
import { Prisma__ApplicantClient } from '#src/generated/models.js';
import prisma from '../../../config/database.js';

class ApplicantService {

  async getAllApplicants() {
    try {
      const applicants = await prisma.$queryRaw`
        SELECT 
          a.*, 
          b.name as "beneficiaryName", 
          b.gender, 
          b."birthDate"
        FROM "Applicant" a
        INNER JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
        ORDER BY a."createdAt" DESC
      `;

      return { success: true, data: applicants, count: applicants.length };
    } catch (error) {
      return { success: false, message: 'Error DB', error: error.message };
    }
  }

  async getApplicantById(id: string) {
    try {
      const applicantRows = await prisma.$queryRaw`
        SELECT *
        FROM "Applicant"
        WHERE "identityCard" = ${id}
      `;
      const applicant = applicantRows[0] as Prisma__ApplicantClient<any, never>;

      if (!applicant) return { success: false, message: 'No encontrado' }

      return { success: true, data: applicant };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createApplicant(data: any) {
    try {
      return await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`
          INSERT INTO "Beneficiary" 
          ("identityCard", "name", "gender", "birthDate", "idType", "idState", "municipalityNumber", "parishNumber")
          VALUES (${data.identityCard}, ${data.name}, ${data.gender}, ${new Date(data.birthDate)}, ${data.idType}, ${data.idState}, ${data.municipalityNumber}, ${data.parishNumber})
        `;

        const newApplicant = await tx.$queryRaw`
          INSERT INTO "Applicant"
          ("identityCard", "email", "cellPhone", "homePhone", "maritalStatus", "workConditionId", "activityConditionId", "applicantEducationLevelId")
          VALUES (${data.identityCard}, ${data.email}, ${data.cellPhone}, ${data.homePhone}, ${data.maritalStatus}, ${data.workConditionId}, ${data.activityConditionId}, ${data.educationLevelId})
          RETURNING *
        `;

        return { success: true, data: newApplicant[0] };
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteApplicant(id: string) {
    try {
      await prisma.$executeRaw`DELETE FROM "Beneficiary" WHERE "identityCard" = ${id}`;
      return { success: true, message: 'Eliminado correctamente' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async searchApplicants(term: string) {
    try {
      const searchTerm = `%${term}%`;
      const applicants = await prisma.$queryRaw`
        SELECT a.*, b.name 
        FROM "Applicant" a
        JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
        WHERE 
          a."identityCard" ILIKE ${searchTerm} OR 
          a."email" ILIKE ${searchTerm} OR
          b."name" ILIKE ${searchTerm}
        LIMIT 20
      `;
      return { success: true, data: applicants };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateHousing(id: string, data: any) {
    try {
      const result = await prisma.$queryRaw`
        INSERT INTO "Housing" 
          ("applicantId", "housingTypeId", "housingConditionId", "roofMaterialId", "floorMaterialId")
        VALUES (${id}, ${data.housingTypeId}, ${data.housingConditionId}, ${data.roofMaterialId}, ${data.floorMaterialId})
        ON CONFLICT ("applicantId") 
        DO UPDATE SET
          "housingTypeId" = EXCLUDED."housingTypeId",
          "housingConditionId" = EXCLUDED."housingConditionId",
          "roofMaterialId" = EXCLUDED."roofMaterialId",
          "floorMaterialId" = EXCLUDED."floorMaterialId"
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateFamily(id: string, familyMembers: any[]) {
    try {
      return await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`DELETE FROM "IncomeFamily" WHERE "applicantId" = ${id}`;

        if (familyMembers && familyMembers.length > 0) {
          for (const member of familyMembers) {
            await tx.$executeRaw`
              INSERT INTO "IncomeFamily" 
              ("applicantId", "fullName", "relationshipId", "age", "profession", "occupation", "monthlyIncome")
              VALUES (${id}, ${member.fullName}, ${member.relationshipId}, ${member.age}, ${member.profession}, ${member.occupation}, ${member.monthlyIncome || 0})
            `;
          }
        }

        const finalFamily = await tx.$queryRaw`SELECT * FROM "IncomeFamily" WHERE "applicantId" = ${id}`;
        return { success: true, data: finalFamily };
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateApplicant(id: string, data: any) {
    try {
      return await prisma.$transaction(async (tx) => {
        if (data.name || data.gender) {
          await tx.$executeRaw`
              UPDATE "Beneficiary" 
              SET "name" = COALESCE(${data.name}, "name"), 
                  "gender" = COALESCE(${data.gender}, "gender") 
              WHERE "identityCard" = ${id}
            `;
        }

        const updatedApp = await tx.$queryRaw`
            UPDATE "Applicant" SET 
              "email" = ${data.email}, 
              "cellPhone" = ${data.cellPhone}, 
              "homePhone" = ${data.homePhone}, 
              "maritalStatus" = ${data.maritalStatus}
            WHERE "identityCard" = ${id}
            RETURNING *
          `;

        return { success: true, data: updatedApp[0] };
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getApplicantCases(id: string) {
    try {
      const cases = await prisma.$queryRaw`
         SELECT c.*, s.description as status
         FROM "Case" c
         LEFT JOIN "CaseStatus" s ON c."idCase" = s."idCase"
         WHERE c."idApplicant" = ${id}
       `;
      return { success: true, data: cases };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

export default new ApplicantService();