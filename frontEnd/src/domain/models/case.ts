import type { CaseDAO } from "#database/daos/caseDAO.ts";
import type { LegalAreaDAO } from "#database/daos/LegalAreaDAO.ts";
import type { ProcessTypeDAO } from "#database/daos/typesDAO.ts";
import type { UserDAO } from "#database/daos/UserDAO.ts";
import type { ApplicantDAO } from "#database/daos/applicantDAO.ts";
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
    compoundKey: string;
    processType: ProcessType;
    problemSummary: string;
    createAt: Date;
    applicantId: PersonID;
    applicantName: string;
    idNucleus: string;
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

export function daoToCaseModel(caseD: CaseDAO, teacherD: UserDAO, applicantD: ApplicantDAO, legalAreaD: LegalAreaDAO): CaseModel {
    return {
        id: caseD.idCase,
        compoundKey: caseD.idNucleus + "_" + caseD.term + "_" + caseD.idCase,
        processType: processTypeDAOToModel(caseD.processType),
        problemSummary: caseD.problemSummary,
        createAt: new Date(caseD.createdAt),
        applicantId: caseD.applicantId,
        applicantName: applicantD.name,
        idNucleus: caseD.idNucleus,
        term: caseD.term,
        idLegalArea: caseD.idLegalArea,
        legalAreaName: legalAreaD.name,
        teacherId: caseD.teacherId,
        teacherName: teacherD.name,
        teacherTerm: caseD.teacherTerm,
        idCourt: caseD.idCourt,
        CasesStatus: null as any,
        lastAction: null as any,
    }
}