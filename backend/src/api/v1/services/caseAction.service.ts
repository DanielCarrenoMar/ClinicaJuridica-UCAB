import prisma from '#src/config/database.js';
class CaseActionService {
  async getAllCaseActions() {
    try {
      const actions = await prisma.$queryRaw`
        SELECT 
          a.*,
          u."fullName" as "userName",
          (c."idNucleus" || '_' || c."term" || '_' || c."idCase") as "caseCompoundKey"
        FROM "CaseAction" a
        JOIN "Case" c ON a."idCase" = c."idCase"
        JOIN "User" u ON a."userId" = u."identityCard"
        ORDER BY a."registryDate" DESC
      `;
      return { success: true, data: actions };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getCaseActionsByUserId(userId: string) {
    try {
      const actions = await prisma.$queryRaw`
        SELECT 
          a.*,
          u."fullName" as "userName",
          (c."idNucleus" || '_' || c."term" || '_' || c."idCase") as "caseCompoundKey"
        FROM "CaseAction" a
        JOIN "Case" c ON a."idCase" = c."idCase"
        JOIN "User" u ON a."userId" = u."identityCard"
        WHERE a."userId" = ${userId}
        ORDER BY a."registryDate" DESC
      `;
      return { success: true, data: actions };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createCaseAction(data: {
    idCase: number;
    description: string;
    notes?: string | null;
    userId: string;
    registryDate?: string | Date;
  }) {
    try {
      if (!data?.idCase || !data?.description || !data?.userId) {
        return { success: false, message: 'Faltan campos requeridos: idCase, description, userId' };
      }

      const registryDate = data.registryDate ? new Date(data.registryDate) : new Date();

      return await prisma.$transaction(async (tx) => {
        const last = await tx.$queryRaw`
          SELECT MAX("actionNumber") as max
          FROM "CaseAction"
          WHERE "idCase" = ${data.idCase}
        `;

        const nextNumber = (Number((last as any)[0]?.max) || 0) + 1;

        await tx.$executeRaw`
          INSERT INTO "CaseAction" (
            "idCase",
            "actionNumber",
            "description",
            "notes",
            "userId",
            "registryDate"
          )
          VALUES (
            ${data.idCase},
            ${nextNumber},
            ${data.description},
            ${data.notes ?? null},
            ${data.userId},
            ${registryDate}
          )
        `;

        const created = await tx.$queryRaw`
          SELECT 
            a.*,
            u."fullName" as "userName",
            c."idNucleus" as "idNucleus",
            c."term" as "term"
          FROM "CaseAction" a
          JOIN "Case" c ON a."idCase" = c."idCase"
          JOIN "User" u ON a."userId" = u."identityCard"
          WHERE a."idCase" = ${data.idCase} AND a."actionNumber" = ${nextNumber}
        `;

        return { success: true, data: (created as any)[0] };
      });
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export default new CaseActionService();
