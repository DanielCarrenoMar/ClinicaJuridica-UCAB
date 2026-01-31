import { SUPPORT_DOCUMENT_URL } from "./apiUrl";
import type { SupportDocumentInfoDAO } from "#database/daos/supportDocumentInfoDAO.ts";
import { daoToSupportDocumentModel } from "#domain/models/supportDocument.ts";
import type { SupportDocumentRepository } from "#domain/repositories.ts";
export function getSupportDocumentRepository(): SupportDocumentRepository {
    return {
        findAllSupportDocuments: async (params) => {
            const query = new URLSearchParams();
            if (params?.page !== undefined) query.set('page', String(params.page));
            if (params?.limit !== undefined) query.set('limit', String(params.limit));
            const url = query.toString() ? `${SUPPORT_DOCUMENT_URL}?${query.toString()}` : SUPPORT_DOCUMENT_URL;
            const responseSupportDocument = await fetch(url, { method: 'GET', credentials: 'include' });
            const supportDocumentData = await responseSupportDocument.json();
            if (!responseSupportDocument.ok) throw new Error(supportDocumentData.message || 'Error fetching support documents');
            const supportDocumentDAOs: SupportDocumentInfoDAO[] = supportDocumentData.data;
            return supportDocumentDAOs.map(daoToSupportDocumentModel);
        },
        findSupportDocumentById: async (id: number) => {
            const responseSupportDocument = await fetch(`${SUPPORT_DOCUMENT_URL}/${id}`, { method: 'GET', credentials: 'include' });
            const supportDocumentData = await responseSupportDocument.json();
            if (!responseSupportDocument.ok) throw new Error(supportDocumentData.message || 'Error fetching support document');
            const supportDocumentDAO: SupportDocumentInfoDAO = supportDocumentData.data;
            return daoToSupportDocumentModel(supportDocumentDAO);
        },
        createSupportDocument: async (data: any) => {
            const isFormData = data instanceof FormData;
            const response = await fetch(SUPPORT_DOCUMENT_URL, {
                method: "POST",
                credentials: 'include',
                headers: isFormData ? {} : { "Content-Type": "application/json" },
                body: isFormData ? data : JSON.stringify(data),
            });
            const datas = await response.json();
            if (!response.ok) throw new Error(datas.message || "Error creating support document");
            const supportDocumentDAO: SupportDocumentInfoDAO = datas.data;
            return daoToSupportDocumentModel(supportDocumentDAO);
        },
        updateSupportDocument: async (id, data: any) => {
            const isFormData = data instanceof FormData;
            const response = await fetch(`${SUPPORT_DOCUMENT_URL}/${id}`, {
                method: "PUT",
                credentials: 'include',
                headers: isFormData ? {} : { "Content-Type": "application/json" },
                body: isFormData ? data : JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error updating support document');
            return result.data;
        },
        deleteSupportDocument: async (idCase, supportNumber) => {
            const response = await fetch(`${SUPPORT_DOCUMENT_URL}/${idCase}/${supportNumber}`, {
                method: "DELETE",
                credentials: 'include'
            });
            const result = await response.json().catch(() => null);
            if (!response.ok) throw new Error(result?.message || 'Error deleting support document');
        },
    }
}