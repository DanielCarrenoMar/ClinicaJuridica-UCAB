import type { ProcessTypeDAO } from "../typesDAO.ts";

export interface CaseDAO {
  problemSummary: string;
  processType: ProcessTypeDAO;
  applicantId: string;
  idNucleus: string;
  idLegalArea: number;
  teacherId?: string;
  teacherTerm?: string;
  idCourt?: number;
  userId: string;
}

export const defaultCaseDAO: CaseDAO = {
  problemSummary: "",
  processType: "A",
  applicantId: "",
  idNucleus: "",
  idLegalArea: 0,
  teacherId: undefined,
  teacherTerm: undefined,
  idCourt: undefined,
  userId: "",
};
