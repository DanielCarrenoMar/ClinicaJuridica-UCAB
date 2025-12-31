import type { CaseStatusEnumDAO } from "#database/typesDAO.ts";
import type { PersonID } from "#domain/mtypes.ts";

export type CaseStatus = "OPEN" | "IN_PROGRESS" | "PAUSED" | "CLOSED";

export interface CaseStatusModel {
    idCase: number;
    caseCompoundKey: string;
    statusNumber: number;
    status: CaseStatus;
    reason: string | null;
    userId: PersonID;
    registryDate: Date;
}

export function caseStatusDAOEnumToModel(caseStatusDAO: CaseStatusEnumDAO): CaseStatus {
    switch (caseStatusDAO) {
        case "A":
            return "OPEN";
        case "T":
            return "IN_PROGRESS";
        case "P":
            return "PAUSED";
        case "C":
            return "CLOSED";
    }
}