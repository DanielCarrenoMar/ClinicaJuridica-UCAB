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
  houseType?: number | null;
  floorMaterial?: number | null;
  wallMaterial?: number | null;
  roofMaterial?: number | null;
  potableWaterService?: number | null;
  sewageService?: number | null;
  cleaningService?: number | null;
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

async function fetchHousingDetails(db: any, applicantId: number | string): Promise<Partial<ApplicantInfoDAO>> {
  try {
    const rows = await db.$queryRaw<{ detailNumber: number; charName: string }[]>`
      SELECT hd."detailNumber", hc."name" as "charName"
      FROM "HousingDetail" hd
      JOIN "HousingCharacteristic" hc ON hd."idCharacteristic" = hc."idCharacteristic"
      WHERE hd."applicantId" = ${applicantId}
    `;

    const result: Partial<ApplicantInfoDAO> = {
      servicesIdAvailable: []
    };

    // Reverse map from DB name to field name
    const DB_TO_FIELD: Record<string, keyof ApplicantDAO> = Object.entries(HOUSING_CHARACTERISTIC_NAMES).reduce((acc, [key, value]) => {
      acc[value] = key as keyof ApplicantDAO;
      return acc;
    }, {} as Record<string, keyof ApplicantDAO>);

    for (const row of rows) {
      if (row.charName === 'Artefactos Domesticos, bienes o servicios del hogar') {
        result.servicesIdAvailable?.push(row.detailNumber);
      } else {
        const fieldName = DB_TO_FIELD[row.charName];
        if (fieldName) {
          // Frontend expects 0-based index, DB has 1-based (detailNumber)
          (result as any)[fieldName] = row.detailNumber - 1;
        }
      }
    }

    return result;
  } catch (error: any) {
    if (isMissingRelationError(error, 'HousingDetail')) return {};
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

  const housingDetails = await fetchHousingDetails(db, applicantId);
  // Merge details into the main row
  const rowWithDetails = { ...rows[0], ...housingDetails };

  // existing mapApplicantRow expects servicesIdAvailable as arg, but let's pass it from housingDetails
  return mapApplicantRow(rowWithDetails, housingDetails.servicesIdAvailable || []);
}

async function fetchApplicantsList(db: any, pagination?: { page: number; limit: number; all: boolean }): Promise<ApplicantInfoDAO[]> {
  try {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 15;
    const all = pagination?.all ?? false;
    const offset = (page - 1) * limit;

    const rows = all
      ? await db.$queryRaw<ApplicantJoinedRow[]>`
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
        `
      : await db.$queryRaw<ApplicantJoinedRow[]>`
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
          LIMIT ${limit} OFFSET ${offset}
        `;

    // We need to fetch housing details for EACH applicant efficiently. 
    // Doing N+1 query for simplicity now, but ideally updated query to JSON_AGG/ARRAY_AGG everything.
    // For now, let's keep it simple as this list probably isn't huge yet.

    const results = await Promise.all(rows.map(async (row: any) => {
      // We'll ignore the COALESCE logic in SQL for servicesIdAvailable and re-fetch to be consistent 
      // OR we can trust SQL for services but we miss other housing details.
      // Better to re-fetch all housing details properly.
      const { servicesIdAvailable: _svc, ...rest } = row;
      const housingDetails = await fetchHousingDetails(db, row.identityCard);
      const merged = { ...rest, ...housingDetails };
      return mapApplicantRow(merged as ApplicantJoinedRow, housingDetails.servicesIdAvailable || []);
    }));

    return results;
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

    // Fallback if missing relation
    return rows.map((row: ApplicantJoinedRow) => mapApplicantRow(row, []));
  }
}


const HOUSING_CHARACTERISTIC_NAMES: Record<string, string> = {
  houseType: 'Tipo de Vivienda',
  floorMaterial: 'Material del piso',
  wallMaterial: 'Material de las paredes',
  roofMaterial: 'Material del techo',
  potableWaterService: 'Servicio de agua potable',
  sewageService: 'Eliminacion de excretas (aguas negras)',
  cleaningService: 'Servicio de aseo',
};

async function saveHousingDetails(tx: any, applicantId: string, data: ApplicantDAO) {
  // 1. Handle services (multi-select)
  if (data.servicesIdAvailable !== undefined) {
    // Delete existing services (using a fixed ID/Name for services if possible, or assumed logic)
    // IMPORTANT: The prompt implies services are also in HousingDetail.
    // Assuming we can identify services by a characteristic, but the seed says 'Artefactos Domesticos...'?
    // Wait, the seed has 'Artefactos Domesticos' as one characteristic.
    // BUT verify seedData.ts line 141 servicesData has IDs 1-7.
    // However, in seed.ts lines 50-52 'Artefactos...' is created.
    // The previous code inserted directly into HousingDetail with detailNumber.
    // Let's keep the existing logic for servicesIdAvailable but wrapped here?
    // No, let's keep services logic as is in the main function or integrate it.

    // Let's focus on the single-selects first.
  }

  const housingFields: (keyof ApplicantDAO)[] = [
    'houseType',
    'floorMaterial',
    'wallMaterial',
    'roofMaterial',
    'potableWaterService',
    'sewageService',
    'cleaningService'
  ];

  for (const field of housingFields) {
    const value = coerceNumber(data[field]);
    if (value !== null) {
      const charName = HOUSING_CHARACTERISTIC_NAMES[field as string];
      if (!charName) continue;

      // Find characteristic ID
      const characteristic = await tx.housingCharacteristic.findUnique({ where: { name: charName } });
      if (!characteristic) continue;

      // Delete existing detail for this characteristic
      await tx.$executeRaw`
        DELETE FROM "HousingDetail" 
        WHERE "applicantId" = ${applicantId} AND "idCharacteristic" = ${characteristic.idCharacteristic}
      `;

      // Insert new detail.
      // NOTE: Frontend sends index (0-based) or value?
      // Seed says detailNumber = detailCounter++ (1-based).
      // Assuming frontend sends 0-based index from a list, we might need value + 1.
      // Checking CreateCaseApplicantStep.tsx...
      // It iterates map((t, i) => <DropdownOption value={i}>)
      // So frontend sends 0, 1, 2...
      // Database seed starts at 1.
      // So we need value + 1.

      const detailNumber = value + 1;

      try {
        await tx.$executeRaw`
          INSERT INTO "HousingDetail" ("applicantId", "idCharacteristic", "detailNumber")
          VALUES (${applicantId}, ${characteristic.idCharacteristic}, ${detailNumber})
        `;
      } catch (e) {
        // Ignore unique constraint or similar if user sends invalid index
        console.error(`Failed to save housing detail ${field} for applicant ${applicantId}:`, e);
      }
    }
  }
}

class ApplicantService {

  async getAllApplicants(pagination?: { page: number; limit: number; all: boolean }): Promise<{ success: boolean; data?: ApplicantInfoDAO[]; error?: string; pagination?: any }> {
    try {
      const page = pagination?.page ?? 1;
      const limit = pagination?.limit ?? 15;
      const all = pagination?.all ?? false;

      const totalRows = await prisma.$queryRaw`
        SELECT COUNT(*)::int as total FROM "Applicant"
      `;
      const total = Array.isArray(totalRows) ? Number(totalRows[0]?.total ?? 0) : 0;

      const applicants = await fetchApplicantsList(prisma, pagination);
      const totalPages = all ? 1 : Math.max(1, Math.ceil(total / limit));
      return {
        success: true,
        data: applicants,
        pagination: {
          page,
          limit: all ? total : limit,
          total,
          totalPages,
          all
        }
      };
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
            ${toDbValue(data.maritalStatus)}, ${toDbValue(data.isConcubine)}, ${toDbValue(data.isHeadOfHousehold)},
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
            ${toDbValue(coerceNumber(data.memberCount))}, ${toDbValue(coerceNumber(data.workingMemberCount))}, 
            ${toDbValue(coerceNumber(data.children7to12Count))}, ${toDbValue(coerceNumber(data.studentChildrenCount))}, 
            ${toDbValue(coerceNumber(data.monthlyIncome))}
          )
        `;
        await tx.$executeRaw`
          INSERT INTO "Housing" ("applicantId", "bathroomCount", "bedroomCount")
          VALUES (${data.identityCard}, ${toDbValue(coerceNumber(data.bathroomCount))}, ${toDbValue(coerceNumber(data.bedroomCount))})
        `;
        if (data.servicesIdAvailable && data.servicesIdAvailable.length > 0) {
          try {
            // For services, we need to know the characteristic ID for 'Artefactos Domesticos...'?
            // Or is servicesIdAvailable relating to a different table?
            // Looking at previous code: INSERT INTO "HousingDetail" ("applicantId", "detailNumber") ...
            // It was missing "idCharacteristic"! This would fail a NOT NULL constraint if idCharacteristic is not default.
            // Schema says: idCharacteristic Int.
            // Previous code: INSERT INTO "HousingDetail" ("applicantId", "detailNumber") VALUES ...
            // This works ONLY if idCharacteristic is not required or has default?
            // Checking schema... idCharacteristic Int (REQUIRED).
            // The previous code WAS BROKEN because it didn't supply idCharacteristic.
            // I must fix this too.
            // Services correspond to 'Artefactos Domesticos...' in seed?
            // Seed data: 'Artefactos Domesticos, bienes o servicios del hogar' (line 50)

            const serviceChar = await tx.housingCharacteristic.findUnique({ where: { name: 'Artefactos Domesticos, bienes o servicios del hogar' } });
            if (serviceChar) {
              for (const serviceId of data.servicesIdAvailable) {
                await tx.$executeRaw`
                     INSERT INTO "HousingDetail" ("applicantId", "idCharacteristic", "detailNumber")
                     VALUES (${data.identityCard}, ${serviceChar.idCharacteristic}, ${serviceId})
                   `;
              }
            }
          } catch (error: any) {
            if (!isMissingRelationError(error, 'HousingDetail')) {
              throw error;
            }
          }
        }

        await saveHousingDetails(tx, data.identityCard, data);
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

        const newId = data.identityCard ? String(data.identityCard) : String(id);
        const oldId = String(id);

        const beneficiaryUpdateCount = await tx.$executeRaw`
          UPDATE "Beneficiary" SET 
            "identityCard" = ${newId},
            "fullName" = COALESCE(${data.fullName}, "fullName"), 
            "gender" = COALESCE(${data.gender}, "gender"),
            "birthDate" = COALESCE(CAST(${data.birthDate} AS DATE), "birthDate"),
            "idNationality" = COALESCE(${data.idNationality}, "idNationality"),
            "idState" = COALESCE(${data.idState}, "idState"),
            "municipalityNumber" = COALESCE(${data.municipalityNumber}, "municipalityNumber"),
            "parishNumber" = COALESCE(${data.parishNumber}, "parishNumber")
          WHERE "identityCard" = ${oldId}
        `;

        if (beneficiaryUpdateCount === 0) {
          throw new Error(`Beneficiary with ID ${oldId} not found.`);
        }

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
          WHERE "identityCard" = ${newId}
        `;

        // Upsert FamilyHome
        const familyHomeUpdateCount = await tx.$executeRaw`
          UPDATE "FamilyHome" SET
            "memberCount" = COALESCE(${memberCount}, "memberCount"),
            "workingMemberCount" = COALESCE(${workingMemberCount}, "workingMemberCount"),
            "children7to12Count" = COALESCE(${children7to12Count}, "children7to12Count"),
            "studentChildrenCount" = COALESCE(${studentChildrenCount}, "studentChildrenCount"),
            "monthlyIncome" = COALESCE(${monthlyIncome}, "monthlyIncome")
          WHERE "applicantId" = ${newId}
        `;

        if (familyHomeUpdateCount === 0) {
          await tx.$executeRaw`
             INSERT INTO "FamilyHome" ("applicantId", "memberCount", "workingMemberCount", "children7to12Count", "studentChildrenCount", "monthlyIncome")
             VALUES (${newId}, ${memberCount}, ${workingMemberCount}, ${children7to12Count}, ${studentChildrenCount}, ${monthlyIncome})
           `;
        }

        // Upsert Housing
        const housingUpdateCount = await tx.$executeRaw`
          UPDATE "Housing" SET
            "bathroomCount" = COALESCE(${bathroomCount}, "bathroomCount"),
            "bedroomCount" = COALESCE(${bedroomCount}, "bedroomCount")
          WHERE "applicantId" = ${newId}
        `;

        if (housingUpdateCount === 0) {
          await tx.$executeRaw`
             INSERT INTO "Housing" ("applicantId", "bathroomCount", "bedroomCount")
             VALUES (${newId}, ${bathroomCount}, ${bedroomCount})
           `;
        }

        if (Array.isArray(data.servicesIdAvailable)) {
          try {
            const serviceChar = await tx.housingCharacteristic.findUnique({ where: { name: 'Artefactos Domesticos, bienes o servicios del hogar' } });
            if (serviceChar) {
              // First ensure HousingDetail parent/structure exists if needed? 
              // HousingDetail depends on Housing. We just upserted Housing, so it should exist.

              // Delete only services
              await tx.$executeRaw`
                    DELETE FROM "HousingDetail" 
                    WHERE "applicantId" = ${newId} AND "idCharacteristic" = ${serviceChar.idCharacteristic}
                `;

              for (const serviceId of data.servicesIdAvailable) {
                await tx.$executeRaw`
                    INSERT INTO "HousingDetail" ("applicantId", "idCharacteristic", "detailNumber")
                    VALUES (${newId}, ${serviceChar.idCharacteristic}, ${serviceId})
                `;
              }
            }
          } catch (error: any) {
            if (!isMissingRelationError(error, 'HousingDetail')) {
              throw error;
            }
          }
        }

        await saveHousingDetails(tx, newId, data as ApplicantDAO);

        const updated = await fetchApplicantInfo(tx, newId);
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