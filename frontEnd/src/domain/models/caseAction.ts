import type { CaseActionInfoDAO } from "#database/daos/caseActionInfoDAO.ts";

export interface CaseActionModel {
    idCase: number;
    caseCompoundKey: string;
    actionNumber: number;
    description: string;
    notes?: string;
    userId: string;
    userName: string;
    registryDate: Date;
}

export function daoToCaseActionModel(dao: CaseActionInfoDAO): CaseActionModel {
    const { registryDate, ...rest } = dao;
    return {
        registryDate: new Date(registryDate),
        ...rest
    }
}