import type { CaseInfoDAO } from "#database/daos/caseInfoDAO.ts";
import { typeDaoToCaseStatusTypeModel, typeDaoToProcessTypeModel, type CaseStatusTypeModel, type ProcessTypeModel } from "#domain/typesModel.ts";

export interface CaseModel {
    idCase: number;
    compoundKey: string;
    problemSummary: string;
    createdAt: Date;
    caseStatus: CaseStatusTypeModel;
    processType: ProcessTypeModel;
    applicantId: string;
    idNucleus: string;
    term: string;
    idLegalArea: number;
    teacherId?: string;
    teacherTerm?: string;
    idCourt?: number;
    applicantName: string;
    legalAreaName: string;
    teacherName: string;
    courtName?: string;
    lastActionDate?: Date;
    lastActionDescription?: string;
}

export function daoToCaseModel(dao:CaseInfoDAO): CaseModel {
    const {processType, caseStatus, createdAt, lastActionDate,...rest} = dao
    return {
        processType: typeDaoToProcessTypeModel(processType),
        caseStatus: typeDaoToCaseStatusTypeModel(caseStatus),
        lastActionDate: lastActionDate ? new Date(lastActionDate) : undefined,
        createdAt: new Date(createdAt),
        ...rest,
    }
}