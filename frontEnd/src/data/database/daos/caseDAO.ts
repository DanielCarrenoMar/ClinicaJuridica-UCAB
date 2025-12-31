import type { CaseStatusEnumDAO, ProcessTypeDAO } from "./typesDAO.ts";

export interface CaseDAO {
  idCase: number;
  problemSummary: string;
  createdAt: string;
  caseStatus: CaseStatusEnumDAO;
  processType: ProcessTypeDAO;
  applicantId: string;
  idNucleus: string;
  term: string;
  idLegalArea: number;
  teacherId: string;
  teacherTerm: string;
  idCourt?: number;
}

export const defaultCaseDAO: CaseDAO = {
  idCase: 0,
  problemSummary: "",
  caseStatus: "A",
  createdAt: "",
  processType: "A",
  applicantId: "",
  idNucleus: "",
  term: "",
  idLegalArea: 0,
  teacherId: "",
  teacherTerm: "",
  idCourt: undefined,
};
