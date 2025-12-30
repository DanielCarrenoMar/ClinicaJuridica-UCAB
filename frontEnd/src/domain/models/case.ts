import type { ProcessTypeDAO } from "#database/daos/typesDAO.ts";
import type { CaseInfoDAO } from "#database/daos/caseInfoDAO.ts";

type ProcessType =
    "IN_PROGRESS" |  // Tramite
    "ADVICE" |  // Asesoria
    "MEDIATION" |  // Conciliacion y mediacion
    "DRAFTING";  // Redaccion

export interface CaseModel {
    idCase: number;
    problemSummary: string;
    createdAt: Date;
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
            return "ADVICE";
        case "CM":
            return "MEDIATION";
        case "R":
            return "DRAFTING";
        case "T":
            return "IN_PROGRESS";
    }
}

export function daoToCaseModel(dao:CaseInfoDAO): CaseModel {
    const {processType ,...rest} = dao
    return {
        processType: processTypeDAOToModel(processType),
        ...rest,
    }
}