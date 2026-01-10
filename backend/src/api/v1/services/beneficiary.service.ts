// @ts-nocheck
import prisma from '#src/config/database.js';

class BeneficiaryService {
  async getAll() {
    try {
      const beneficiaries = await prisma.$queryRaw`
        SELECT
          b.*,
          s."name" AS "stateName",
          m."name" AS "municipalityName",
          p."name" AS "parishName"
        FROM "Beneficiary" b
        LEFT JOIN "State" s ON b."idState" = s."idState"
        LEFT JOIN "Municipality" m ON b."idState" = m."idState" AND b."municipalityNumber" = m."municipalityNumber"
        LEFT JOIN "Parish" p ON b."idState" = p."idState" AND b."municipalityNumber" = p."municipalityNumber" AND b."parishNumber" = p."parishNumber"
      `;
      return { success: true, data: beneficiaries };
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
              WHEN b."identityCard" ~ '^[0-9]+$' THEN b."identityCard"::bigint
              ELSE NULL
            END
          ) AS "maxIdentityCard"
          FROM "Beneficiary" b
          WHERE b."hasId" = false
        `;

        const maxIdentityCard = Array.isArray(maxResult) ? maxResult[0]?.maxIdentityCard : null;
        const nextIdentityCard = (maxIdentityCard ? BigInt(maxIdentityCard) : 0n) + 1n;
        identityCardToUse = nextIdentityCard.toString();
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
}

export default new BeneficiaryService();

