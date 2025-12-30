// @ts-nocheck
import prisma from '../../../config/database.js';

class ApplicantService {

  async getAllApplicants() {
    try {
      const applicants = await prisma.$queryRaw`
        SELECT 
          a.*, 
          b.name, b.gender, b."birthDate", b."idNacionality",
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
      const applicantRows = await prisma.$queryRaw`
        SELECT
          a."identityCard",
          a."email",
          a."cellPhone",
          a."homePhone",
          a."maritalStatus",
          a."isConcubine",
          a."createdAt",
          a."isHeadOfHousehold",
          a."headEducationLevelId",
          a."headStudyTime",
          a."applicantEducationLevelId",
          a."applicantStudyTime",
          a."workConditionId",
          a."activityConditionId",
          b."fullName",
          b."gender",
          b."birthDate",
          b."idNacionality",
          b."idState",
          b."municipalityNumber",
          b."parishNumber",
          s."name" AS "stateName",
          m."name" AS "municipalityName",
          p."name" AS "parishName",
          fh."memberCount",
          fh."workingMemberCount",
          fh."children7to12Count",
          fh."studentChildrenCount",
          fh."monthlyIncome",
          h."bathroomCount",
          h."bedroomCount",
          hel."name" AS "headEducationLevelName",
          ael."name" AS "applicantEducationLevel",
          wc."name" AS "workConditionName",
          ac."name" AS "activityConditionName"
        FROM "Applicant" a
        INNER JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
        LEFT JOIN "FamilyHome" fh ON fh."applicantId" = a."identityCard"
        LEFT JOIN "Housing" h ON h."applicantId" = a."identityCard"
        LEFT JOIN "EducationLevel" hel ON a."headEducationLevelId" = hel."idLevel"
        LEFT JOIN "EducationLevel" ael ON a."applicantEducationLevelId" = ael."idLevel"
        LEFT JOIN "WorkCondition" wc ON a."workConditionId" = wc."idCondition"
        LEFT JOIN "ActivityCondition" ac ON a."activityConditionId" = ac."idActivity"
        LEFT JOIN "State" s ON b."idState" = s."idState"
        LEFT JOIN "Municipality" m ON b."idState" = m."idState" AND b."municipalityNumber" = m."municipalityNumber"
        LEFT JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
        WHERE a."identityCard" = ${id}
        LIMIT 1
      `;

      const applicant = Array.isArray(applicantRows) && applicantRows.length > 0 ? applicantRows[0] : null;

      if (!applicant) {
        return { success: false, message: 'Solicitante no encontrado' };
      }

      return { success: true, data: applicant };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createApplicant(data: any) {
    try {
      return await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
          INSERT INTO "Beneficiary" 
          ("identityCard", "name", "gender", "birthDate", "idNacionality", "hasId", "type", "idState", "municipalityNumber", "parishNumber")
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