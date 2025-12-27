import type { PersonID, IdNacionality } from "#domain/mtypes.ts";

export interface CaseActionModel {
    idCase: number;
    caseCompoundKey: string;
    actionNumber: number;
    description: string;
    notes: string | null;
    userId: PersonID;
    userNacionality: IdNacionality;
    userName: string;
    registryDate: Date;
}