import type { ProcessTypeDTO } from "../typesDAO.ts";

export interface CaseDAO {
  problemSummary: string;
  processType: ProcessTypeDTO;
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
  processType: "",
  applicantId: "",
  idNucleus: "",
  idLegalArea: 0,
  teacherId: undefined,
  teacherTerm: undefined,
  idCourt: undefined,
  userId: "",
};
