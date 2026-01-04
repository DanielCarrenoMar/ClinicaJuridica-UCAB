import type { SupportDocumentInfoDAO } from "#database/daos/supportDocumentInfoDAO.ts";

export interface SupportDocumentModel {
    idCase: number;
    supportNumber: number;
    title: string;
    description: string;
    submissionDate: Date;
    fileUrl: string;
}

export function daoToSupportDocumentModel(dao: SupportDocumentInfoDAO): SupportDocumentModel {
    const { submissionDate, ...rest } = dao;
    return {
        submissionDate: new Date(submissionDate),
        ...rest
    }
}