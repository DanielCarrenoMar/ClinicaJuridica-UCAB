import type { CaseDAO } from "#database/daos/CaseDAO.ts";
import type { ProcessTypeDAO } from "#database/daos/typesDAO.ts";
import type { PersonID } from "#domain/mtypes.ts";
import type { CaseActionModel } from "./caseAction";
import type { CaseStatus } from "./caseStatus";

type ProcessType = 
    "IN_PROGRESS" |  // Tramite
    "ADVICE" |  // Asesoria
    "MEDIATION" |  // Conciliacion y mediacion
    "DRAFTING";  // Redaccion

export interface CaseModel {
    id: number;
    compoundKey: string; // GUAYANA_24_15_01 por ejemplo
    processType: ProcessType;
    problemSummary: string;
    createAt: Date;
    applicantId: PersonID;
    applicantName: string;
    idNucleus: number;
    term: string;
    idLegalArea: number;
    legalAreaName: string;
    teacherId: PersonID;
    teacherName: string;
    teacherTerm: string;
    idCourt?: number;
    CasesStatus: CaseStatus;
    lastAction?: CaseActionModel;
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

export function daoToCaseModel(dao: CaseDAO): CaseModel {
    return {
        id: dao.idCase,
        compoundKey: "proceso",
        processType: processTypeDAOToModel(dao.processType),
        problemSummary: dao.problemSummary,
        createAt: new Date(dao.createdAt),
        applicantId: dao.applicantId,
        applicantName: "proceso",
        idNucleus: dao.idNucleus,
        term: dao.term,
        idLegalArea: dao.idLegalArea,
        legalAreaName: "proceso",
        teacherId: dao.teacherId,
        teacherName: "proceso",
        teacherTerm: dao.teacherTerm,
        idCourt: dao.idCourt,
        CasesStatus: null as any,
        lastAction: null as any,
    }
}