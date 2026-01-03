import type { SupportDocumentDAO } from "./supportDocumentDAO";

export interface SupportDocumentInfoDAO extends SupportDocumentDAO {
    caseCompoundKey: string;
}