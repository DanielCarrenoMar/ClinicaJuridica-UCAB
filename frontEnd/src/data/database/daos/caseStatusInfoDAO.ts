import type { CaseStatusDAO } from "./caseStatusDAO.ts";

export interface CaseStatusInfoDAO extends CaseStatusDAO {
  userName: string;
  caseCompoundKey: string;
}
