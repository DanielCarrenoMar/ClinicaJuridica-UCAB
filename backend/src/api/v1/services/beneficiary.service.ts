// @ts-nocheck
import prisma from '../../../config/database.js';

class BeneficiaryService {
  async getAll() {
    try {
      const beneficiaries = await prisma.$queryRaw`
        SELECT * FROM "Beneficiary"
      `;
      return { success: true, data: beneficiaries };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getById(id: string) {
    try {
      const result = await prisma.$queryRaw`
        SELECT * FROM "Beneficiary" 
        WHERE "identityCard" = ${id}
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
      const result = await prisma.$queryRaw`
        INSERT INTO "Beneficiary" (
          "identityCard", "name", "gender", "birthDate", 
          "idType", "hasId", "type", "idState", 
          "municipalityNumber", "parishNumber"
        )
        VALUES (
          ${data.identityCard}, ${data.name}, ${data.gender}, CAST(${data.birthDate} AS DATE), 
          ${data.idType}, ${data.hasId}, ${data.type}, ${data.idState}, 
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
      const result = await prisma.$queryRaw`
        UPDATE "Beneficiary"
        SET 
          "name" = COALESCE(${data.name}, "name"),
          "gender" = COALESCE(${data.gender}, "gender"),
          "birthDate" = COALESCE(CAST(${data.birthDate} AS DATE), "birthDate"),
          "idType" = COALESCE(${data.idType}, "idType"),
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