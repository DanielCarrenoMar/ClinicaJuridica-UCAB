export type CaseStatus = "OPEN" | "IN_PROGRESS" | "PAUSED" | "CLOSED";

export interface CaseStatusModel {
    idCase: number;
    statusNumber: number;
    status: CaseStatus;
    reason: string | null;
    userId: string;
    registryDate: Date;
}   