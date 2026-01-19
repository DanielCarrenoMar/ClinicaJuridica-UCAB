// @ts-nocheck
import prisma from '#src/config/database.js';

class BeneficiaryService {
  async getAll(pagination?: { page: number; limit: number; all: boolean }) {
    try {
      const page = pagination?.page ?? 1;
      const limit = pagination?.limit ?? 15;
      const all = pagination?.all ?? false;
      const offset = (page - 1) * limit;

      const totalRows = await prisma.$queryRaw`
        SELECT COUNT(*)::int as total FROM "Beneficiary"
      `;
      const total = Array.isArray(totalRows) ? Number(totalRows[0]?.total ?? 0) : 0;

      const beneficiaries = all
        ? await prisma.$queryRaw`
          SELECT
            b.*,
            s."name" AS "stateName",
            m."name" AS "municipalityName",
            p."name" AS "parishName"
          FROM "Beneficiary" b
          LEFT JOIN "State" s ON b."idState" = s."idState"
          LEFT JOIN "Municipality" m ON b."idState" = m."idState" AND b."municipalityNumber" = m."municipalityNumber"
          LEFT JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
        `
        : await prisma.$queryRaw`
          SELECT
            b.*,
            s."name" AS "stateName",
            m."name" AS "municipalityName",
            p."name" AS "parishName"
          FROM "Beneficiary" b
          LEFT JOIN "State" s ON b."idState" = s."idState"
          LEFT JOIN "Municipality" m ON b."idState" = m."idState" AND b."municipalityNumber" = m."municipalityNumber"
          LEFT JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
          LIMIT ${limit} OFFSET ${offset}
        `;

      const totalPages = all ? 1 : Math.max(1, Math.ceil(total / limit));
      return {
        success: true,
        data: beneficiaries,
        pagination: {
          page,
          limit: all ? total : limit,
          total,
          totalPages,
          all
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getById(id: string) {
    try {
      const result = await prisma.$queryRaw`
        SELECT
          b.*,
          s."name" AS "stateName",
          m."name" AS "municipalityName",
          p."name" AS "parishName"
        FROM "Beneficiary" b
        LEFT JOIN "State" s ON b."idState" = s."idState"
        LEFT JOIN "Municipality" m ON b."idState" = m."idState" AND b."municipalityNumber" = m."municipalityNumber"
        LEFT JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
        WHERE b."identityCard" = ${id}
      `;
      
      if (!Array.isArray(result) || result.length === 0) {
        return { success: false, message: 'Beneficiario no encontrado' };
      }

      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async create(data: any) {
    try {
      const fullName = data.fullName ?? data.name;
      const idNationality = data.idNationality ?? data.idType;

      const providedIdentityCard = (data.identityCard ?? "").toString().trim();
      let identityCardToUse = providedIdentityCard;
      let hasIdToUse = data.hasId;

      if (identityCardToUse.length === 0) {
        const maxResult = await prisma.$queryRaw`
          SELECT MAX(
            CASE
              WHEN b."identityCard" ~ '^NoCed[0-9]+$' THEN SUBSTRING(b."identityCard", 6)::bigint
              ELSE NULL
            END
          ) AS "maxIdentityCard"
          FROM "Beneficiary" b
          WHERE b."hasId" = false
        `;

        const maxIdentityCard = Array.isArray(maxResult) ? maxResult[0]?.maxIdentityCard : null;
        const nextIdentityCard = (maxIdentityCard ? BigInt(maxIdentityCard) : 0n) + 1n;
        identityCardToUse = `NoCed${nextIdentityCard.toString()}`;
        hasIdToUse = false;
      }

      console.log("Creating beneficiary with identityCard:", identityCardToUse);

      const result = await prisma.$queryRaw`
        INSERT INTO "Beneficiary" (
          "identityCard", "fullName", "gender", "birthDate", 
          "idNationality", "hasId", "type", "idState", 
          "municipalityNumber", "parishNumber"
        )
        VALUES (
          ${identityCardToUse}, ${fullName}, ${data.gender}, CAST(${data.birthDate} AS DATE), 
          ${idNationality}, ${hasIdToUse}, ${data.type}, ${data.idState}, 
          ${data.municipalityNumber}, ${data.parishNumber}
        )
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async update(id: string, data: any) {
    try {
      const fullName = data.fullName ?? data.name;
      const idNationality = data.idNationality ?? data.idNationality ?? data.idType;
      const result = await prisma.$queryRaw`
        UPDATE "Beneficiary"
        SET 
          "fullName" = COALESCE(${fullName}, "fullName"),
          "gender" = COALESCE(${data.gender}, "gender"),
          "birthDate" = COALESCE(CAST(${data.birthDate} AS DATE), "birthDate"),
          "idNationality" = COALESCE(${idNationality}, "idNationality"),
          "hasId" = COALESCE(${data.hasId}, "hasId"),
          "type" = COALESCE(${data.type}, "type"),
          "idState" = COALESCE(${data.idState}, "idState"),
          "municipalityNumber" = COALESCE(${data.municipalityNumber}, "municipalityNumber"),
          "parishNumber" = COALESCE(${data.parishNumber}, "parishNumber")
        WHERE "identityCard" = ${id}
        RETURNING *
      `;

      if (!result[0]) {
        return { success: false, message: 'Beneficiario no encontrado' };
      }

      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async delete(id: string) {
    try {
      await prisma.$executeRaw`
        DELETE FROM "Beneficiary" 
        WHERE "identityCard" = ${id}
      `;
      return { success: true, message: 'Beneficiario eliminado' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCases(id: string) {
    try {
      const cases = await prisma.$queryRaw`
        SELECT * FROM "Case" 
        WHERE "applicantId" = ${id}
        ORDER BY "createdAt" DESC
      `;
      return { success: true, data: cases };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getBeneficiaryTypeStats(startDate?: string, endDate?: string) {
    try {
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `AND c."createdAt" >= CAST(${startDate} AS DATE) AND c."createdAt" <= CAST(${endDate} AS DATE)`;
      }

      const result = await prisma.$queryRaw`
        SELECT 
          cb.type,
          COUNT(DISTINCT cb."beneficiaryId") as count
        FROM "CaseBeneficiary" cb
        INNER JOIN "Case" c ON cb."idCase" = c."idCase"
        WHERE 1=1 ${dateFilter}
        GROUP BY cb.type
        ORDER BY cb.type
      `;

      const stats = Array.isArray(result) ? result : [];
      
      const formattedStats = [
        {
          label: 'Beneficiarios Directos',
          value: Number(stats.find((s: any) => s.type === 'D')?.count || 0),
          color: '#3498DB'
        },
        {
          label: 'Beneficiarios Indirectos', 
          value: Number(stats.find((s: any) => s.type === 'I')?.count || 0),
          color: '#E74C3C'
        }
      ];

      return { success: true, data: formattedStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new BeneficiaryService();

