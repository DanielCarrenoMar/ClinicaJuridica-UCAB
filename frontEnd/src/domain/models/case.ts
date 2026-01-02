import type { ProcessTypeDAO } from "#database/typesDAO.ts";
import type { CaseInfoDAO } from "#database/daos/caseInfoDAO.ts";
import { caseStatusDAOEnumToModel, type CaseStatus } from "./caseStatus";
import type { ProcessType } from "#domain/mtypes.ts";

export interface CaseModel {
    idCase: number;
    compoundKey: string;
    problemSummary: string;
    createdAt: Date;
    caseStatus: CaseStatus;
    processType: ProcessType;
    applicantId: string;
    idNucleus: string;
    term: string;
    idLegalArea: number;
    teacherId: string;
    teacherTerm: string;
    idCourt?: number;
    applicantName: string;
    legalAreaName: string;
    teacherName: string;
    courtName?: string;
    lastActionDate?: Date;
    lastActionDescription?: string;
}

function processTypeDAOToModel(processTypeDAO: ProcessTypeDAO): ProcessType {
    switch (processTypeDAO) {
        case "A":
            return "advice";
        case "CM":
            return "mediation";
        case "R":
            return "drafting";
        case "T":
            return "in progress";
    }
}

export function daoToCaseModel(dao:CaseInfoDAO): CaseModel {
    const {processType, caseStatus, createdAt, lastActionDate,...rest} = dao
    return {
        processType: processTypeDAOToModel(processType),
        caseStatus: caseStatusDAOEnumToModel(caseStatus),
        lastActionDate: lastActionDate ? new Date(lastActionDate) : undefined,
        createdAt: new Date(createdAt),
        ...rest,
    }
}