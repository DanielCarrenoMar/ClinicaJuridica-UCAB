// @ts-nocheck
import { prisma } from '../../../config/database.js';

class ApplicantService {
  async getAllApplicants() {
    try {
      const applicants = await prisma.$queryRaw`
        SELECT 
          a.*, 
          b."fullName", b."gender", b."birthDate", b."idNacionality", b."idState", b."municipalityNumber", b."parishNumber",
          h."bathroomCount", h."bedroomCount",
          fh."memberCount", fh."workingMemberCount", fh."children7to12Count", fh."studentChildrenCount", fh."monthlyIncome"
        FROM "Applicant" a
        INNER JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
        LEFT JOIN "Housing" h ON a."identityCard" = h."applicantId"
        LEFT JOIN "FamilyHome" fh ON a."identityCard" = fh."applicantId"
        ORDER BY a."createdAt" DESC
      `;
      return { success: true, data: applicants };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getApplicantById(id) {
    try {
      const applicantRows = await prisma.$queryRaw`
        SELECT
          b."identityCard", b."fullName", b."gender", b."birthDate", b."idNacionality",
          b."idState", b."municipalityNumber", b."parishNumber",
          a."email", a."cellPhone", a."homePhone", a."maritalStatus", a."isConcubine",
          a."createdAt", a."isHeadOfHousehold", a."headEducationLevelId", a."headStudyTime",
          a."applicantEducationLevel", a."applicantStudyTime", a."workConditionId", a."activityConditionId",
          fh."memberCount", fh."workingMemberCount", fh."children7to12Count", 
          fh."studentChildrenCount", fh."monthlyIncome",
          h."bathroomCount", h."bedroomCount",
          hel."name" AS "headEducationLevelName",
          wc."name" AS "workConditionName",
          ac."name" AS "activityConditionName"
        FROM "Applicant" a
        INNER JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
        LEFT JOIN "FamilyHome" fh ON fh."applicantId" = a."identityCard"
        LEFT JOIN "Housing" h ON h."applicantId" = a."identityCard"
        LEFT JOIN "EducationLevel" hel ON a."headEducationLevelId" = hel."idLevel"
        LEFT JOIN "WorkCondition" wc ON a."workConditionId" = wc."idCondition"
        LEFT JOIN "ActivityCondition" ac ON a."activityConditionId" = ac."idActivity"
        WHERE a."identityCard" = ${id}
        LIMIT 1
      `;

      if (!applicantRows[0]) return { success: false, message: 'No encontrado' };

      const servicesRows = await prisma.$queryRaw`
        SELECT "serviceId" 
        FROM "ApplicantServiceAvailability" 
        WHERE "applicantId" = ${id}
      `;

      return { 
        success: true, 
        data: {
          ...applicantRows[0],
          servicesIdAvailable: servicesRows.map(s => s.serviceId)
        } 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createApplicant(data) {
    try {
      return await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
          INSERT INTO "Beneficiary" 
          ("identityCard", "fullName", "gender", "birthDate", "idNacionality", "hasId", "type", "idState", "municipalityNumber", "parishNumber")
          VALUES (
            ${data.identityCard}, ${data.fullName}, ${data.gender}, 
            CAST(${data.birthDate} AS DATE), ${data.idNacionality}, 
            true, 'S', ${data.idState}, ${data.municipalityNumber}, ${data.parishNumber}
          )
        `;

        await tx.$executeRaw`
          INSERT INTO "Applicant"
          (
            "identityCard", "email", "cellPhone", "homePhone", "maritalStatus", 
            "isConcubine", "isHeadOfHousehold", "headEducationLevelId", "headStudyTime",
            "applicantEducationLevel", "applicantStudyTime", "workConditionId", "activityConditionId"
          )
          VALUES (
            ${data.identityCard}, ${data.email}, ${data.cellPhone}, ${data.homePhone}, 
            ${data.maritalStatus}, ${data.isConcubine || false}, ${data.isHeadOfHousehold || false},
            ${data.headEducationLevelId}, ${data.headStudyTime}, ${data.applicantEducationLevel},
            ${data.applicantStudyTime}, ${data.workConditionId}, ${data.activityConditionId}
          )
        `;

        if (data.servicesIdAvailable && data.servicesIdAvailable.length > 0) {
          for (const serviceId of data.servicesIdAvailable) {
            await tx.$executeRaw`
              INSERT INTO "ApplicantServiceAvailability" ("applicantId", "serviceId")
              VALUES (${data.identityCard}, ${serviceId})
            `;
          }
        }

        const result = await tx.$queryRaw`
          SELECT a.*, b."fullName", b."gender", b."birthDate", b."idNacionality", b."idState", b."municipalityNumber", b."parishNumber"
          FROM "Applicant" a JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
          WHERE a."identityCard" = ${data.identityCard}
        `;

        return { success: true, data: { ...result[0], servicesIdAvailable: data.servicesIdAvailable || [] } };
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateApplicant(id, data) {
    try {
      return await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
          UPDATE "Beneficiary" SET 
            "fullName" = COALESCE(${data.fullName}, "fullName"), 
            "gender" = COALESCE(${data.gender}, "gender"),
            "idState" = COALESCE(${data.idState}, "idState"),
            "municipalityNumber" = COALESCE(${data.municipalityNumber}, "municipalityNumber"),
            "parishNumber" = COALESCE(${data.parishNumber}, "parishNumber")
          WHERE "identityCard" = ${id}
        `;

        await tx.$executeRaw`
          UPDATE "Applicant" SET 
            "email" = COALESCE(${data.email}, "email"), 
            "cellPhone" = COALESCE(${data.cellPhone}, "cellPhone"), 
            "homePhone" = COALESCE(${data.homePhone}, "homePhone"), 
            "maritalStatus" = COALESCE(${data.maritalStatus}, "maritalStatus"),
            "isConcubine" = COALESCE(${data.isConcubine}, "isConcubine"),
            "isHeadOfHousehold" = COALESCE(${data.isHeadOfHousehold}, "isHeadOfHousehold"),
            "headEducationLevelId" = COALESCE(${data.headEducationLevelId}, "headEducationLevelId"),
            "headStudyTime" = COALESCE(${data.headStudyTime}, "headStudyTime"),
            "applicantEducationLevel" = COALESCE(${data.applicantEducationLevel}, "applicantEducationLevel"),
            "applicantStudyTime" = COALESCE(${data.applicantStudyTime}, "applicantStudyTime"),
            "workConditionId" = COALESCE(${data.workConditionId}, "workConditionId"),
            "activityConditionId" = COALESCE(${data.activityConditionId}, "activityConditionId")
          WHERE "identityCard" = ${id}
        `;

        if (data.servicesIdAvailable) {
          await tx.$executeRaw`DELETE FROM "ApplicantServiceAvailability" WHERE "applicantId" = ${id}`;
          for (const serviceId of data.servicesIdAvailable) {
            await tx.$executeRaw`
              INSERT INTO "ApplicantServiceAvailability" ("applicantId", "serviceId")
              VALUES (${id}, ${serviceId})
            `;
          }
        }

        const result = await tx.$queryRaw`
          SELECT a.*, b."fullName", b."gender", b."birthDate", b."idNacionality", b."idState", b."municipalityNumber", b."parishNumber"
          FROM "Applicant" a JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
          WHERE a."identityCard" = ${id}
        `;

        return { success: true, data: { ...result[0], servicesIdAvailable: data.servicesIdAvailable } };
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteApplicant(id) {
    try {
      await prisma.$executeRaw`DELETE FROM "Beneficiary" WHERE "identityCard" = ${id}`;
      return { success: true, message: 'Eliminado correctamente' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new ApplicantService();

