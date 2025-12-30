// @ts-nocheck
import prisma from '../../../config/database.js';

class ApplicantService {

  async getAllApplicants() {
    try {
      const applicants = await prisma.$queryRaw`
        SELECT 
          a.*, 
          b.name, b.gender, b."birthDate", b."idType", b.type as "beneficiaryType",
          h."bathroomCount", h."bedroomCount",
          f."memberCount", f."monthlyIncome"
        FROM "Applicant" a
        INNER JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
        LEFT JOIN "Housing" h ON a."identityCard" = h."applicantId"
        LEFT JOIN "FamilyHome" f ON a."identityCard" = f."applicantId"
        ORDER BY a."createdAt" DESC
      `;

      return { success: true, data: applicants, count: applicants.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getApplicantById(id: string) {
    try {
      const result = await prisma.$queryRaw`
        SELECT 
          a.*,
          b.name, b.gender, b."birthDate", b."idType", b."hasId", b.type as "beneficiaryType",
          b."idState", b."municipalityNumber", b."parishNumber",
          h."bathroomCount", h."bedroomCount", h."housingTypeId", h."housingConditionId", h."roofMaterialId", h."floorMaterialId",
          f."memberCount", f."workingMemberCount", f."children7to12Count", f."studentChildrenCount", f."monthlyIncome"
        FROM "Applicant" a
        INNER JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
        LEFT JOIN "Housing" h ON a."identityCard" = h."applicantId"
        LEFT JOIN "FamilyHome" f ON a."identityCard" = f."applicantId"
        WHERE a."identityCard" = ${id}
      `;

      if (!Array.isArray(result) || result.length === 0) {
        return { success: false, message: 'No encontrado' };
      }

      const row = result[0];
      const data = {
        ...row,
        housing: row.housingTypeId !== null ? {
          housingTypeId: row.housingTypeId,
          housingConditionId: row.housingConditionId,
          roofMaterialId: row.roofMaterialId,
          floorMaterialId: row.floorMaterialId,
          bathroomCount: row.bathroomCount,
          bedroomCount: row.bedroomCount
        } : null,
        familyHome: row.memberCount !== null ? {
          memberCount: row.memberCount,
          monthlyIncome: row.monthlyIncome,
          workingMemberCount: row.workingMemberCount,
          children7to12Count: row.children7to12Count,
          studentChildrenCount: row.studentChildrenCount
        } : null
      };

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createApplicant(data: any) {
    try {
      return await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
          INSERT INTO "Beneficiary" 
          ("identityCard", "name", "gender", "birthDate", "idType", "hasId", "type", "idState", "municipalityNumber", "parishNumber")
          VALUES (${data.identityCard}, ${data.name}, ${data.gender}, CAST(${data.birthDate} AS DATE), ${data.idType}, ${data.hasId}, ${data.type}, ${data.idState}, ${data.municipalityNumber}, ${data.parishNumber})
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
              "email" = COALESCE(${data.email}, "email"), 
              "cellPhone" = COALESCE(${data.cellPhone}, "cellPhone"), 
              "homePhone" = COALESCE(${data.homePhone}, "homePhone"), 
              "maritalStatus" = COALESCE(${data.maritalStatus}, "maritalStatus")
            WHERE "identityCard" = ${id}
            RETURNING *
          `;

        return { success: true, data: updatedApp[0] };
      });
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

  async getApplicantCases(id: string) {
    try {
      const cases = await prisma.$queryRaw`
         SELECT c.*
         FROM "Case" c
         WHERE c."applicantId" = ${id}
         ORDER BY c."createdAt" DESC
       `;
      return { success: true, data: cases };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

export default new ApplicantService();