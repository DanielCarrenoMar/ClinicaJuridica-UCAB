import type { CaseStatusDAO } from "./caseStatusDAO.ts";

export interface CaseStatusInfoDAO extends CaseStatusDAO {
  idCase: number;
  statusNumber: number;
  registryDate: Date;
  userName: string;
  caseCompoundKey: string;
}
