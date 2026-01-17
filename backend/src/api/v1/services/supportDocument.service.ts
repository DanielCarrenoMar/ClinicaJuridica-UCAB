import prisma from '#src/config/database.js';

class SupportDocumentService {

    async getAllSupportDocuments(pagination?: { page: number; limit: number; all: boolean }) {
        try {
            const page = pagination?.page ?? 1;
            const limit = pagination?.limit ?? 15;
            const all = pagination?.all ?? false;
            const offset = (page - 1) * limit;

            const totalRows = await prisma.$queryRaw`
                SELECT COUNT(*)::int as total FROM "SupportDocument"
            `;
            const total = Array.isArray(totalRows) ? Number(totalRows[0]?.total ?? 0) : 0;

            const documents = all
                ? await prisma.$queryRaw`
                    SELECT * FROM "SupportDocument" ORDER BY "submissionDate" DESC
                `
                : await prisma.$queryRaw`
                    SELECT * FROM "SupportDocument" ORDER BY "submissionDate" DESC
                    LIMIT ${limit} OFFSET ${offset}
                `;

            const totalPages = all ? 1 : Math.max(1, Math.ceil(total / limit));
            return {
                success: true,
                data: documents,
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

    async getSupportDocumentById(idCase: number, supportNumber: number) {
        try {
            const document = await prisma.$queryRaw`
                SELECT * FROM "SupportDocument"
                WHERE "idCase" = ${idCase} AND "supportNumber" = ${supportNumber}
                LIMIT 1
            `;

            if (!Array.isArray(document) || document.length === 0) {
                return { success: false, message: 'Documento no encontrado' };
            }

            return { success: true, data: document[0] };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    async createSupportDocument(data: any) {
        try {
            const result = await prisma.$transaction(async (tx) => {
                // Calculate next support number if not provided
                if (!data.supportNumber) {
                    const maxDoc = await tx.$queryRaw<{ client_max: number }[]>`
                        SELECT MAX("supportNumber") as client_max
                        FROM "SupportDocument"
                        WHERE "idCase" = ${data.idCase}
                    `;
                    const currentMax = maxDoc[0]?.client_max ?? 0;
                    data.supportNumber = currentMax + 1;
                }

                await tx.$executeRaw`
                    INSERT INTO "SupportDocument" (
                        "idCase", "supportNumber", "title", "description", 
                        "submissionDate", "fileUrl"
                    ) VALUES (
                        ${data.idCase}, ${data.supportNumber}, ${data.title}, 
                        ${data.description}, CAST(${data.submissionDate} AS TIMESTAMP), ${data.fileUrl || null}
                    )
                `;

                const newDocument = await tx.$queryRaw`
                    SELECT * FROM "SupportDocument"
                    WHERE "idCase" = ${data.idCase} AND "supportNumber" = ${data.supportNumber}
                    LIMIT 1
                `;

                if (!Array.isArray(newDocument) || newDocument.length === 0) {
                    throw new Error("Failed to retrieve created document");
                }
                return newDocument[0];
            });

            return { success: true, data: result };
        } catch (error: any) {
            console.log(error);
            return { success: false, error: error.message };
        }
    }

    async updateSupportDocument(idCase: number, supportNumber: number, data: any) {
        try {
            await prisma.$executeRaw`
                UPDATE "SupportDocument"
                SET 
                    "title" = COALESCE(${data.title}, "title"),
                    "description" = COALESCE(${data.description}, "description"),
                    "submissionDate" = COALESCE(CAST(${data.submissionDate} AS TIMESTAMP), "submissionDate"),
                    "fileUrl" = COALESCE(${data.fileUrl}, "fileUrl")
                WHERE "idCase" = ${idCase} AND "supportNumber" = ${supportNumber}
            `;

            const updated = await prisma.$queryRaw`
                SELECT * FROM "SupportDocument"
                WHERE "idCase" = ${idCase} AND "supportNumber" = ${supportNumber}
                LIMIT 1
            `;

            if (!Array.isArray(updated) || updated.length === 0) {
                return { success: false, message: 'Error al actualizar documento' };
            }

            return { success: true, data: updated[0] };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    async deleteSupportDocument(idCase: number, supportNumber: number) {
        try {
            await prisma.$executeRaw`
                DELETE FROM "SupportDocument"
                WHERE "idCase" = ${idCase} AND "supportNumber" = ${supportNumber}
            `;
            return { success: true, message: 'Documento eliminado exitosamente' };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
}

export default new SupportDocumentService();
