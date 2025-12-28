export interface SupportDocumentModel {
    idCase: number;
    caseCompoundKey: string;
    supportNumber: number;
    title: string;
    description: string;
    submissionDate: Date;
    fileUrl?: string;
}