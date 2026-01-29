import type { CaseStatusInfoDAO } from "#database/daos/caseStatusInfoDAO.ts";
import { typeDtoToCaseStatusTypeModel, type CaseStatusTypeModel } from "#domain/typesModel.ts";

export interface CaseStatusModel {
    idCase: number;
    caseCompoundKey: string;
    statusNumber: number;
    status: CaseStatusTypeModel;
    reason?: string;
    userId: string;
    userName: string;
    registryDate: Date;
}

export function daoToCaseStatusModel(dao: CaseStatusInfoDAO): CaseStatusModel {
    const { status, registryDate, ...rest } = dao;
    return {
        registryDate: new Date(registryDate),
        status: typeDtoToCaseStatusTypeModel(status),
        ...rest
    }
}