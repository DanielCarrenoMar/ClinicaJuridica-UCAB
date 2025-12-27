import type { CaseActionModel } from "./caseAction";
import type { CaseStatus } from "./caseStatus";

type ProcessType = "IN_PROGRESS" |  // Tramite
    "ADVICE" |  // Asesoria
    "MEDIATION" |  // Conciliacion y mediacion
    "DRAFTING";  // Redaccion

export interface CaseModel {
    id: number;
    compoundKey: string; // GUAYANA_24_15_01 por ejemplo
    processType: ProcessType;
    problemSummary: string;
    createAt: Date;
    applicantId: number;
    applicantName: string;
    idNucleus: number;
    term: string;
    idLegalArea: number;
    legalAreaName: string;
    teacherId: number;
    teacherName: string;
    teacherTerm: string;
    idCourt: number | null;
    CasesStatus: CaseStatus;
    lastAction: CaseActionModel | null;
}