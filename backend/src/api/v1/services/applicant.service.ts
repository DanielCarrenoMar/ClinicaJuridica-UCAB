import {prisma} from '../../../config/database.js';

import type { ApplicantResponse, RawApplicantDB } from '../interfaces/Applicant.js';

class ApplicantService {
  
  async getAllApplicants(): Promise<{ success: boolean; data?: ApplicantResponse[]; error?: string }> {
    try {
      const applicants = await prisma.$queryRaw<RawApplicantDB[]>`
        SELECT 
          a.*, 
          b."fullName", b."gender", b."birthDate", b."idNacionality", b."idState", b."municipalityNumber", b."parishNumber",
          fh."memberCount", fh."workingMemberCount", fh."children7to12Count", fh."studentChildrenCount", fh."monthlyIncome",
          h."bathroomCount", h."bedroomCount"
        FROM "Applicant" a
        INNER JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
        LEFT JOIN "FamilyHome" fh ON a."identityCard" = fh."applicantId"
        LEFT JOIN "Housing" h ON a."identityCard" = h."applicantId"
        ORDER BY a."createdAt" DESC
      `;

      const mappedApplicants = applicants.map(app => ({
        ...app,
        applicantEducationLevel: app.applicantEducationLevelId,
      } as unknown as ApplicantResponse));

      return { success: true, data: mappedApplicants };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getApplicantById(id: number | string): Promise<{ success: boolean; data?: ApplicantResponse; message?: string; error?: string }> {
    try {
      const applicantRows = await prisma.$queryRaw<RawApplicantDB[]>`
        SELECT
          a.*,
          b."fullName", b."gender", b."birthDate", b."idNacionality",
          b."idState", b."municipalityNumber", b."parishNumber",
          fh."memberCount", fh."workingMemberCount", fh."children7to12Count", 
          fh."studentChildrenCount", fh."monthlyIncome",
          h."bathroomCount", h."bedroomCount"
        FROM "Applicant" a
        INNER JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
        LEFT JOIN "FamilyHome" fh ON a."identityCard" = fh."applicantId"
        LEFT JOIN "Housing" h ON a."identityCard" = h."applicantId"
        WHERE a."identityCard" = ${id}
        LIMIT 1
      `;

      if (!applicantRows[0]) return { success: false, message: 'No encontrado' };

      // NOTA: Esto funcionará solo si la tabla existe en la BD física
      const servicesRows = await prisma.$queryRaw<{ serviceId: number }[]>`
        SELECT "serviceId" 
        FROM "ApplicantServiceAvailability" 
        WHERE "applicantId" = ${id}
      `;

      const rawData = applicantRows[0];
      
      const finalData = {
        ...rawData,
        applicantEducationLevel: rawData.applicantEducationLevelId,
        servicesIdAvailable: servicesRows.map(s => s.serviceId)
      } as unknown as ApplicantResponse;

      return { 
        success: true, 
        data: finalData
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createApplicant(data: ApplicantResponse): Promise<{ success: boolean; data?: ApplicantResponse; error?: string }> {
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
            "applicantEducationLevelId", "applicantStudyTime", "workConditionId", "activityConditionId"
          )
          VALUES (
            ${data.identityCard}, ${data.email}, ${data.cellPhone}, ${data.homePhone}, 
            ${data.maritalStatus}, ${data.isConcubine || false}, ${data.isHeadOfHousehold || false},
            ${data.headEducationLevelId}, ${data.headStudyTime}, 
            ${data.applicantEducationLevel}, 
            ${data.applicantStudyTime}, ${data.workConditionId}, ${data.activityConditionId}
          )
        `;
        await tx.$executeRaw`
          INSERT INTO "FamilyHome"
          ("applicantId", "memberCount", "workingMemberCount", "children7to12Count", "studentChildrenCount", "monthlyIncome")
          VALUES (
            ${data.identityCard}, 
            ${data.memberCount || 0}, ${data.workingMemberCount || 0}, 
            ${data.children7to12Count || 0}, ${data.studentChildrenCount || 0}, 
            ${data.monthlyIncome || 0}
          )
        `;
        await tx.$executeRaw`
          INSERT INTO "Housing" ("applicantId", "bathroomCount", "bedroomCount")
          VALUES (${data.identityCard}, ${data.bathroomCount || 0}, ${data.bedroomCount || 0})
        `;
        if (data.servicesIdAvailable && data.servicesIdAvailable.length > 0) {
          for (const serviceId of data.servicesIdAvailable) {
            await tx.$executeRaw`
              INSERT INTO "ApplicantServiceAvailability" ("applicantId", "serviceId")
              VALUES (${data.identityCard}, ${serviceId})
            `;
          }
        }
        const result = await tx.$queryRaw<RawApplicantDB[]>`
          SELECT 
            a.*, 
            b."fullName", b."gender", b."birthDate", b."idNacionality", b."idState", b."municipalityNumber", b."parishNumber",
            fh."memberCount", fh."workingMemberCount", fh."children7to12Count", fh."studentChildrenCount", fh."monthlyIncome",
            h."bathroomCount", h."bedroomCount"
          FROM "Applicant" a 
          INNER JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
          LEFT JOIN "FamilyHome" fh ON a."identityCard" = fh."applicantId"
          LEFT JOIN "Housing" h ON a."identityCard" = h."applicantId"
          WHERE a."identityCard" = ${data.identityCard}
        `;

        const rawData = result[0];

        const finalData = {
           ...rawData,
           applicantEducationLevel: rawData.applicantEducationLevelId,
           servicesIdAvailable: data.servicesIdAvailable || [] 
        } as unknown as ApplicantResponse;

        return { 
          success: true, 
          data: finalData
        };
      });
    } catch (error: any) {
      console.error(error);
      return { success: false, error: error.message };
    }
  }

  async updateApplicant(id: number | string, data: Partial<ApplicantResponse>): Promise<{ success: boolean; data?: ApplicantResponse; error?: string }> {
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
            "applicantEducationLevelId" = COALESCE(${data.applicantEducationLevel}, "applicantEducationLevelId"),
            "applicantStudyTime" = COALESCE(${data.applicantStudyTime}, "applicantStudyTime"),
            "workConditionId" = COALESCE(${data.workConditionId}, "workConditionId"),
            "activityConditionId" = COALESCE(${data.activityConditionId}, "activityConditionId")
          WHERE "identityCard" = ${id}
        `;
        await tx.$executeRaw`
          UPDATE "FamilyHome" SET
            "memberCount" = COALESCE(${data.memberCount}, "memberCount"),
            "workingMemberCount" = COALESCE(${data.workingMemberCount}, "workingMemberCount"),
            "children7to12Count" = COALESCE(${data.children7to12Count}, "children7to12Count"),
            "studentChildrenCount" = COALESCE(${data.studentChildrenCount}, "studentChildrenCount"),
            "monthlyIncome" = COALESCE(${data.monthlyIncome}, "monthlyIncome")
          WHERE "applicantId" = ${id}
        `;
        await tx.$executeRaw`
          UPDATE "Housing" SET
            "bathroomCount" = COALESCE(${data.bathroomCount}, "bathroomCount"),
            "bedroomCount" = COALESCE(${data.bedroomCount}, "bedroomCount")
          WHERE "applicantId" = ${id}
        `;
        if (Array.isArray(data.servicesIdAvailable)) {
          await tx.$executeRaw`DELETE FROM "ApplicantServiceAvailability" WHERE "applicantId" = ${id}`;
          for (const serviceId of data.servicesIdAvailable) {
            await tx.$executeRaw`
              INSERT INTO "ApplicantServiceAvailability" ("applicantId", "serviceId")
              VALUES (${id}, ${serviceId})
            `;
          }
        }

        const result = await tx.$queryRaw<RawApplicantDB[]>`
          SELECT 
            a.*, 
            b."fullName", b."gender", b."birthDate", b."idNacionality", 
            b."idState", b."municipalityNumber", b."parishNumber",
            fh."memberCount", fh."workingMemberCount", fh."children7to12Count", fh."studentChildrenCount", fh."monthlyIncome",
            h."bathroomCount", h."bedroomCount"
          FROM "Applicant" a 
          JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
          LEFT JOIN "FamilyHome" fh ON a."identityCard" = fh."applicantId"
          LEFT JOIN "Housing" h ON a."identityCard" = h."applicantId"
          WHERE a."identityCard" = ${id}
          LIMIT 1
        `;

        if (!result || result.length === 0) throw new Error("Applicant not found");
        
        const rawData = result[0];

        const finalData = {
            ...rawData,
            applicantEducationLevel: rawData.applicantEducationLevelId,
            servicesIdAvailable: data.servicesIdAvailable || [] 
        } as unknown as ApplicantResponse;

        return { 
          success: true, 
          data: finalData
        };
      });
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteApplicant(id: number | string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      await prisma.$executeRaw`DELETE FROM "Beneficiary" WHERE "identityCard" = ${id}`;
      return { success: true, message: 'Eliminado correctamente' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export default new ApplicantService();

