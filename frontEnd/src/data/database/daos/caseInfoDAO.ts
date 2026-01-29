import type { CaseDAO } from "./caseDAO.ts";
import type { CaseStatusTypeDTO } from "../typesDAO.ts";

export interface CaseInfoDAO extends CaseDAO {
  idCase: number;
  applicantName: string;
  legalAreaName: string;
  teacherName: string;
  courtName?: string;
  term: string;
  lastActionDate?: Date;
  lastActionDescription?: string;
  caseStatus: CaseStatusTypeDTO;
  compoundKey: string;
  createdAt: string;
  subjectName: string;
  subjectCategoryName: string;

}