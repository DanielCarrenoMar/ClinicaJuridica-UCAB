import type { ProcessTypeDAO } from "./typesDAO.ts";

export interface CaseDAO {
  idCase: number;
  problemSummary: string;
  createdAt: Date;
  processType: ProcessTypeDAO;
  applicantId: string;
  idNucleus: number;
  term: string;
  idLegalArea: number;
  teacherId: string;
  teacherTerm: string;
  idCourt?: number;
}
