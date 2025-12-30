import type { ProcessTypeDAO } from "./typesDAO.ts";

export interface CaseDAO {
  idCase: number;
  problemSummary: string;
  createdAt: Date;
  processType: ProcessTypeDAO;
  applicantId: string;
  applicantName: string;
  idNucleus: string;
  term: string;
  idLegalArea: number;
  legalAreaName: string;
  teacherId: string;
  teacherTerm: string;
  teacherName: string;
  idCourt?: number;
  courtName?: string;
}

export const defaultCaseDAO: CaseDAO = {
  idCase: 0,
  problemSummary: "",
  createdAt: new Date(),
  processType: "A",
  applicantId: "",
  idNucleus: "",
  term: "",
  idLegalArea: 0,
  teacherId: "",
  teacherTerm: "",
  idCourt: undefined,
};
