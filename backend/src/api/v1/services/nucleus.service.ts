// @ts-nocheck
import prisma from '#src/config/database.js';

class NucleusService {
    async getAllNuclei() {
        try {
            const nuclei = await prisma.$queryRaw`
        SELECT 
          n.*,
          p."name" as "parishName",
          m."name" as "municipalityName",
          s."name" as "stateName",
          COALESCE(case_counts."caseCount", 0)::int as "caseCount"
        FROM "Nucleus" n
        JOIN "Parish" p ON n."idState" = p."idState" 
          AND n."municipalityNumber" = p."municipalityNumber" 
          AND n."parishNumber" = p."parishNumber"
        JOIN "Municipality" m ON p."idState" = m."idState" 
          AND p."municipalityNumber" = m."municipalityNumber"
        JOIN "State" s ON m."idState" = s."idState"
        LEFT JOIN (
          SELECT "idNucleus", COUNT(*)::int as "caseCount"
          FROM "Case"
          GROUP BY "idNucleus"
        ) case_counts ON n."idNucleus" = case_counts."idNucleus"
      `;

            return { success: true, data: nuclei };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async createNucleus(data: {
        idNucleus: string;
        idState: number;
        municipalityNumber: number;
        parishNumber: number;
        isActive?: boolean;
    }) {
        try {
            const newNucleus = await prisma.$queryRaw`
        INSERT INTO "Nucleus" ("idNucleus", "idState", "municipalityNumber", "parishNumber", "isActive")
        VALUES (${data.idNucleus}, ${data.idState}, ${data.municipalityNumber}, ${data.parishNumber}, ${data.isActive ?? true})
        RETURNING *
      `;

            // We need to fetch the full info to return the model with names if needed, 
            // but for simplicity we return what we have and let the frontend refresh.
            // Or we can perform a join.
            const result = await prisma.$queryRaw`
        SELECT 
          n.*,
          p."name" as "parishName",
          m."name" as "municipalityName",
          s."name" as "stateName",
          0::int as "caseCount"
        FROM "Nucleus" n
        JOIN "Parish" p ON n."idState" = p."idState" 
          AND n."municipalityNumber" = p."municipalityNumber" 
          AND n."parishNumber" = p."parishNumber"
        JOIN "Municipality" m ON p."idState" = m."idState" 
          AND p."municipalityNumber" = m."municipalityNumber"
        JOIN "State" s ON m."idState" = s."idState"
        WHERE n."idNucleus" = ${data.idNucleus}
      `;

            return { success: true, data: result[0], message: 'Núcleo creado exitosamente' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteNucleus(idNucleus: string) {
        try {
            const counts = await prisma.$queryRaw`
        SELECT COUNT(*)::int as cases FROM "Case" WHERE "idNucleus" = ${idNucleus}
      ` as any[];

            if (counts[0].cases > 0) {
                return {
                    success: false,
                    message: 'No se puede eliminar el núcleo porque tiene casos asociados'
                };
            }

            await prisma.$executeRaw`
        DELETE FROM "Nucleus" WHERE "idNucleus" = ${idNucleus}
      `;

            return { success: true, message: 'Núcleo eliminado correctamente' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new NucleusService();
