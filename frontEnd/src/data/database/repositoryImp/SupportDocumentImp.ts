import { SUPPORT_DOCUMENT_URL } from "./apiUrl";
import type { SupportDocumentInfoDAO } from "#database/daos/supportDocumentInfoDAO.ts";
import { daoToSupportDocumentModel } from "#domain/models/supportDocument.ts";
import type { SupportDocumentRepository } from "#domain/repositories.ts";
export function getSupportDocumentRepository(): SupportDocumentRepository {
    return {
        findAllSupportDocuments: async () => {
            const responseSupportDocument = await fetch(SUPPORT_DOCUMENT_URL);
            const supportDocumentData = await responseSupportDocument.json();
            const supportDocumentDAOs: SupportDocumentInfoDAO[] = supportDocumentData.data;
            return supportDocumentDAOs.map(daoToSupportDocumentModel);
        },
        findSupportDocumentById: async (id: number) => {
            const responseSupportDocument = await fetch(`${SUPPORT_DOCUMENT_URL}/${id}`);
            if (!responseSupportDocument.ok) return null;
            const supportDocumentData = await responseSupportDocument.json();
            const supportDocumentDAO: SupportDocumentInfoDAO = supportDocumentData.data;
            return daoToSupportDocumentModel(supportDocumentDAO);
        },
        createSupportDocument: async (data) => {
            const response = await fetch(SUPPORT_DOCUMENT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Error creating support document");
            const datas = await response.json();
            const supportDocumentDAO: SupportDocumentInfoDAO = datas.data;
            return daoToSupportDocumentModel(supportDocumentDAO);
        },
        updateSupportDocument: async (id, data) => {
            const response = await fetch(`${SUPPORT_DOCUMENT_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            return result.data;
        },
        deleteSupportDocument: async (idCase, supportNumber) => {
            await fetch(`${SUPPORT_DOCUMENT_URL}/${idCase}/${supportNumber}`, {
                method: "DELETE",
            });
        },
    }
}