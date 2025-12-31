import type { PersonID } from "#domain/mtypes.ts";
import type { CaseActionInfoDAO } from "#database/daos/caseActionInfoDAO.ts";
import type { CaseDAO } from "#database/daos/caseDAO.ts";
export interface CaseActionModel {
    idCase: number;
    caseCompoundKey: string;
    actionNumber: number;
    description: string;
    notes: string | null;
    userId: PersonID;
    userName: string;
    registryDate: Date;
}

export function daoToCaseActionModel(caseActionD: CaseActionInfoDAO, caseD: CaseDAO): CaseActionModel {
    return {
        idCase: caseActionD.idCase,
        caseCompoundKey: `${caseD.idNucleus}_${caseD.teacherTerm}_${caseD.idCase}`,
        actionNumber: caseActionD.actionNumber,
        description: caseActionD.description,
        notes: caseActionD.notes ?? null,
        userId: caseActionD.userId,
        userName: caseActionD.userName,
        registryDate: caseActionD.registryDate

    }
}