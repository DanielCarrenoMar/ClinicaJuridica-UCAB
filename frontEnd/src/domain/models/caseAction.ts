import type { idNacionality } from "#domain/mtypes.ts";

export interface CaseActionModel {
    idCase: number;
    caseCompoundKey: string;
    actionNumber: number;
    description: string;
    notes: string | null;
    userId: number;
    userNacionality: idNacionality;
    userName: string;
    registryDate: Date;
}