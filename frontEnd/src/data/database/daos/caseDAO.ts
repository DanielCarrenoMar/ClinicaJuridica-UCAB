import type { ProcessTypeDAO } from "../typesDAO.ts";

export interface CaseDAO {
  problemSummary: string;
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
  problemSummary: "",
  processType: "A",
  applicantId: "",
  idNucleus: "",
  term: "",
  idLegalArea: 0,
  teacherId: "",
  teacherTerm: "",
  idCourt: undefined,
};
