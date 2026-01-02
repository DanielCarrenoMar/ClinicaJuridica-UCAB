import type { CaseDAO } from "./caseDAO.ts";
import type { CaseStatusEnumDAO } from "../typesDAO.ts";

export interface CaseInfoDAO extends CaseDAO {
  idCase: number;
  applicantName: string;
  legalAreaName: string;
  teacherName: string;
  courtName?: string;
  lastActionDate?: Date;
  lastActionDescription?: string;
  caseStatus: CaseStatusEnumDAO;
  compoundKey: string;
  createdAt: string;
}