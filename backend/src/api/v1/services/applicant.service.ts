import prisma from '#src/config/database.js';

type ApplicantDAO = {
  identityCard: string;
  fullName: string;
  gender: unknown;
  birthDate: string | Date;
  idNationality: unknown;

  idState?: number | null;
  municipalityNumber?: number | null;
  parishNumber?: number | null;

  email?: string | null;
  cellPhone?: string | null;
  homePhone?: string | null;
  maritalStatus?: unknown;
  isConcubine?: boolean | null;
  isHeadOfHousehold?: boolean | null;

  headEducationLevelId?: number | null;
  headStudyTime?: string | null;
  applicantEducationLevel?: number | string | null;
  applicantStudyTime?: string | null;

  workConditionId?: number | null;
  activityConditionId?: number | null;

  memberCount?: number | null;
  workingMemberCount?: number | null;
  children7to12Count?: number | null;
  studentChildrenCount?: number | null;
  monthlyIncome?: number | string | null;

  bathroomCount?: number | null;
  bedroomCount?: number | null;

  servicesIdAvailable?: number[];
};

type ApplicantInfoDAO = ApplicantDAO & {
  createdAt: Date;
  headEducationLevelName?: string | null;
  workConditionName?: string | null;
  activityConditionName?: string | null;

  stateName?: string | null;
  municipalityName?: string | null;
  parishName?: string | null;
};

type ApplicantJoinedRow = Omit<ApplicantInfoDAO, 'applicantEducationLevel' | 'servicesIdAvailable'> & {
  applicantEducationLevelId?: number | null;
};

function coerceNumber(value: any): number | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toDbValue<T>(value: T | null | undefined): T | null {
  return value === undefined ? null : value;
}

function isMissingRelationError(error: any, relationName: string): boolean {
  const msg = error?.message ? String(error.message).toLowerCase() : '';
  return (msg.includes('does not exist') || msg.includes('no existe')) && msg.includes(relationName.toLowerCase());
}

function mapApplicantRow(row: ApplicantJoinedRow, servicesIdAvailable: number[]): ApplicantInfoDAO {
  const { applicantEducationLevelId, ...rest } = row;

  return {
    ...(rest as ApplicantInfoDAO),
    applicantEducationLevel: applicantEducationLevelId ?? null,
    servicesIdAvailable,
  };
}

async function fetchServicesIdAvailable(db: any, applicantId: number | string): Promise<number[]> {
  try {
    const rows = await db.$queryRaw<{ serviceId: number }[]>`
      SELECT "detailNumber" as "serviceId"
      FROM "HousingDetail"
      WHERE "applicantId" = ${applicantId}
    `;
    return rows.map((r: { serviceId: number }) => r.serviceId);
  } catch (error: any) {
    if (isMissingRelationError(error, 'HousingDetail')) return [];
    throw error;
  }
}

async function fetchApplicantInfo(db: any, applicantId: number | string): Promise<ApplicantInfoDAO | null> {
  const rows = await db.$queryRaw<ApplicantJoinedRow[]>`
    SELECT
      a.*,
      b."fullName", b."gender", b."birthDate", b."idNationality",
      b."idState", b."municipalityNumber", b."parishNumber",
      s."name" AS "stateName",
      m."name" AS "municipalityName",
      p."name" AS "parishName",
      he."name" AS "headEducationLevelName",
      wc."name" AS "workConditionName",
      ac."name" AS "activityConditionName",
      fh."memberCount", fh."workingMemberCount", fh."children7to12Count",
      fh."studentChildrenCount", fh."monthlyIncome",
      h."bathroomCount", h."bedroomCount"
    FROM "Applicant" a
    INNER JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
    LEFT JOIN "State" s ON b."idState" = s."idState"
    LEFT JOIN "Municipality" m ON b."idState" = m."idState" AND b."municipalityNumber" = m."municipalityNumber"
    LEFT JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
    LEFT JOIN "EducationLevel" he ON a."headEducationLevelId" = he."idLevel"
    LEFT JOIN "WorkCondition" wc ON a."workConditionId" = wc."idCondition"
    LEFT JOIN "ActivityCondition" ac ON a."activityConditionId" = ac."idActivity"
    LEFT JOIN "FamilyHome" fh ON a."identityCard" = fh."applicantId"
    LEFT JOIN "Housing" h ON a."identityCard" = h."applicantId"
    WHERE a."identityCard" = ${applicantId}
    LIMIT 1
  `;

  if (!rows[0]) return null;

  const servicesIdAvailable = await fetchServicesIdAvailable(db, applicantId);
  return mapApplicantRow(rows[0], servicesIdAvailable);
}

async function fetchApplicantsList(db: any): Promise<ApplicantInfoDAO[]> {
  try {
    const rows = await db.$queryRaw<ApplicantJoinedRow[]>`
      SELECT
        a.*,
        b."fullName", b."gender", b."birthDate", b."idNationality",
        b."idState", b."municipalityNumber", b."parishNumber",
        s."name" AS "stateName",
        m."name" AS "municipalityName",
        p."name" AS "parishName",
        he."name" AS "headEducationLevelName",
        wc."name" AS "workConditionName",
        ac."name" AS "activityConditionName",
        fh."memberCount", fh."workingMemberCount", fh."children7to12Count",
        fh."studentChildrenCount", fh."monthlyIncome",
        h."bathroomCount", h."bedroomCount",
        COALESCE(
          (
            SELECT ARRAY_AGG(asa."detailNumber")
            FROM "HousingDetail" asa
            WHERE asa."applicantId" = a."identityCard"
          ),
          ARRAY[]::INTEGER[]
        ) AS "servicesIdAvailable"
      FROM "Applicant" a
      INNER JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
      LEFT JOIN "State" s ON b."idState" = s."idState"
      LEFT JOIN "Municipality" m ON b."idState" = m."idState" AND b."municipalityNumber" = m."municipalityNumber"
      LEFT JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
      LEFT JOIN "EducationLevel" he ON a."headEducationLevelId" = he."idLevel"
      LEFT JOIN "WorkCondition" wc ON a."workConditionId" = wc."idCondition"
      LEFT JOIN "ActivityCondition" ac ON a."activityConditionId" = ac."idActivity"
      LEFT JOIN "FamilyHome" fh ON a."identityCard" = fh."applicantId"
      LEFT JOIN "Housing" h ON a."identityCard" = h."applicantId"
      ORDER BY a."createdAt" DESC
    `;

    return rows.map((row: any) => {
      const servicesIdAvailable = Array.isArray(row.servicesIdAvailable) ? row.servicesIdAvailable : [];
      const { servicesIdAvailable: _svc, ...rest } = row;
      return mapApplicantRow(rest as ApplicantJoinedRow, servicesIdAvailable);
    });
  } catch (error: any) {
    if (!isMissingRelationError(error, 'HousingDetail')) throw error;

    const rows = await db.$queryRaw<ApplicantJoinedRow[]>`
      SELECT
        a.*,
        b."fullName", b."gender", b."birthDate", b."idNationality",
        b."idState", b."municipalityNumber", b."parishNumber",
        s."name" AS "stateName",
        m."name" AS "municipalityName",
        p."name" AS "parishName",
        he."name" AS "headEducationLevelName",
        wc."name" AS "workConditionName",
        ac."name" AS "activityConditionName",
        fh."memberCount", fh."workingMemberCount", fh."children7to12Count",
        fh."studentChildrenCount", fh."monthlyIncome",
        h."bathroomCount", h."bedroomCount"
      FROM "Applicant" a
      INNER JOIN "Beneficiary" b ON a."identityCard" = b."identityCard"
      LEFT JOIN "State" s ON b."idState" = s."idState"
      LEFT JOIN "Municipality" m ON b."idState" = m."idState" AND b."municipalityNumber" = m."municipalityNumber"
      LEFT JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
      LEFT JOIN "EducationLevel" he ON a."headEducationLevelId" = he."idLevel"
      LEFT JOIN "WorkCondition" wc ON a."workConditionId" = wc."idCondition"
      LEFT JOIN "ActivityCondition" ac ON a."activityConditionId" = ac."idActivity"
      LEFT JOIN "FamilyHome" fh ON a."identityCard" = fh."applicantId"
      LEFT JOIN "Housing" h ON a."identityCard" = h."applicantId"
      ORDER BY a."createdAt" DESC
    `;

    return rows.map((row: ApplicantJoinedRow) => mapApplicantRow(row, []));
  }
}

class ApplicantService {

  async getAllApplicants(): Promise<{ success: boolean; data?: ApplicantInfoDAO[]; error?: string }> {
    try {
      const applicants = await fetchApplicantsList(prisma);
      return { success: true, data: applicants };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getApplicantById(id: number | string): Promise<{ success: boolean; data?: ApplicantInfoDAO; message?: string; error?: string }> {
    try {
      const applicant = await fetchApplicantInfo(prisma, id);
      if (!applicant) return { success: false, message: 'No encontrado' };
      return { success: true, data: applicant };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createApplicant(data: ApplicantDAO): Promise<{ success: boolean; data?: ApplicantInfoDAO; error?: string }> {
    try {
      return await prisma.$transaction(async (tx) => {
        let applicantEducationLevelId = coerceNumber(data.applicantEducationLevel);

        if (!applicantEducationLevelId && typeof data.applicantEducationLevel === 'string') {
          const level = await tx.educationLevel.findUnique({ where: { name: data.applicantEducationLevel } });
          applicantEducationLevelId = level?.idLevel ?? null;
        }
        await tx.$executeRaw`
          INSERT INTO "Beneficiary" 
          ("identityCard", "fullName", "gender", "birthDate", "idNationality", "hasId", "type", "idState", "municipalityNumber", "parishNumber")
          VALUES (
            ${data.identityCard}, ${data.fullName}, ${data.gender}, 
            CAST(${data.birthDate} AS DATE), ${data.idNationality}, 
            true, 'S', ${toDbValue(data.idState)}, ${toDbValue(data.municipalityNumber)}, ${toDbValue(data.parishNumber)}
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
            ${data.identityCard}, ${toDbValue(data.email)}, ${toDbValue(data.cellPhone)}, ${toDbValue(data.homePhone)}, 
            ${toDbValue(data.maritalStatus)}, ${data.isConcubine ?? false}, ${data.isHeadOfHousehold ?? false},
            ${toDbValue(data.headEducationLevelId)}, ${toDbValue(data.headStudyTime)}, 
            ${applicantEducationLevelId}, 
            ${toDbValue(data.applicantStudyTime)}, ${toDbValue(data.workConditionId)}, ${toDbValue(data.activityConditionId)}
          )
        `;
        await tx.$executeRaw`
          INSERT INTO "FamilyHome"
          ("applicantId", "memberCount", "workingMemberCount", "children7to12Count", "studentChildrenCount", "monthlyIncome")
          VALUES (
            ${data.identityCard}, 
            ${coerceNumber(data.memberCount) ?? 0}, ${coerceNumber(data.workingMemberCount) ?? 0}, 
            ${coerceNumber(data.children7to12Count) ?? 0}, ${coerceNumber(data.studentChildrenCount) ?? 0}, 
            ${coerceNumber(data.monthlyIncome) ?? 0}
          )
        `;
        await tx.$executeRaw`
          INSERT INTO "Housing" ("applicantId", "bathroomCount", "bedroomCount")
          VALUES (${data.identityCard}, ${coerceNumber(data.bathroomCount) ?? 0}, ${coerceNumber(data.bedroomCount) ?? 0})
        `;
        if (data.servicesIdAvailable && data.servicesIdAvailable.length > 0) {
          try {
            for (const serviceId of data.servicesIdAvailable) {
              await tx.$executeRaw`
                INSERT INTO "HousingDetail" ("applicantId", "detailNumber")
                VALUES (${data.identityCard}, ${serviceId})
              `;
            }
          } catch (error: any) {
            if (!isMissingRelationError(error, 'HousingDetail')) {
              throw error;
            }
          }
        }
        const created = await fetchApplicantInfo(tx, data.identityCard);
        if (!created) throw new Error('Applicant not found after create');

        return { success: true, data: created };
      });
    } catch (error: any) {
      console.error(error);
      return { success: false, error: error.message };
    }
  }

  async updateApplicant(id: number | string, data: Partial<ApplicantDAO>): Promise<{ success: boolean; data?: ApplicantInfoDAO; error?: string }> {
    try {
      return await prisma.$transaction(async (tx) => {
        let applicantEducationLevelId = coerceNumber(data.applicantEducationLevel);
        if (!applicantEducationLevelId && typeof data.applicantEducationLevel === 'string') {
          const level = await tx.educationLevel.findUnique({ where: { name: data.applicantEducationLevel } });
          applicantEducationLevelId = level?.idLevel ?? null;
        }

        const memberCount = coerceNumber(data.memberCount);
        const workingMemberCount = coerceNumber(data.workingMemberCount);
        const children7to12Count = coerceNumber(data.children7to12Count);
        const studentChildrenCount = coerceNumber(data.studentChildrenCount);
        const monthlyIncome = coerceNumber(data.monthlyIncome);
        const bathroomCount = coerceNumber(data.bathroomCount);
        const bedroomCount = coerceNumber(data.bedroomCount);

        await tx.$executeRaw`
          UPDATE "Beneficiary" SET 
            "fullName" = COALESCE(${data.fullName}, "fullName"), 
            "gender" = COALESCE(${data.gender}, "gender"),
            "birthDate" = COALESCE(CAST(${data.birthDate} AS DATE), "birthDate"),
            "idNationality" = COALESCE(${data.idNationality}, "idNationality"),
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
            "applicantEducationLevelId" = COALESCE(${applicantEducationLevelId}, "applicantEducationLevelId"),
            "applicantStudyTime" = COALESCE(${data.applicantStudyTime}, "applicantStudyTime"),
            "workConditionId" = COALESCE(${data.workConditionId}, "workConditionId"),
            "activityConditionId" = COALESCE(${data.activityConditionId}, "activityConditionId")
          WHERE "identityCard" = ${id}
        `;
        await tx.$executeRaw`
          UPDATE "FamilyHome" SET
            "memberCount" = COALESCE(${memberCount}, "memberCount"),
            "workingMemberCount" = COALESCE(${workingMemberCount}, "workingMemberCount"),
            "children7to12Count" = COALESCE(${children7to12Count}, "children7to12Count"),
            "studentChildrenCount" = COALESCE(${studentChildrenCount}, "studentChildrenCount"),
            "monthlyIncome" = COALESCE(${monthlyIncome}, "monthlyIncome")
          WHERE "applicantId" = ${id}
        `;
        await tx.$executeRaw`
          UPDATE "Housing" SET
            "bathroomCount" = COALESCE(${bathroomCount}, "bathroomCount"),
            "bedroomCount" = COALESCE(${bedroomCount}, "bedroomCount")
          WHERE "applicantId" = ${id}
        `;
        if (Array.isArray(data.servicesIdAvailable)) {
          try {
            await tx.$executeRaw`DELETE FROM "HousingDetail" WHERE "applicantId" = ${id}`;
            for (const serviceId of data.servicesIdAvailable) {
              await tx.$executeRaw`
                INSERT INTO "HousingDetail" ("applicantId", "detailNumber")
                VALUES (${id}, ${serviceId})
              `;
            }
          } catch (error: any) {
            if (!isMissingRelationError(error, 'HousingDetail')) {
              throw error;
            }
          }
        }

        const updated = await fetchApplicantInfo(tx, id);
        if (!updated) throw new Error('Applicant not found');
        return { success: true, data: updated };
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