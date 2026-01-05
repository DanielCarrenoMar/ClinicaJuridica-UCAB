import type { CaseStatusTypeDAO } from "../typesDAO.ts";

export interface CaseStatusDAO {
  status: CaseStatusTypeDAO;
  reason?: string;
  userId: string;
}
