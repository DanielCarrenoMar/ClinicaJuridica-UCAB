import type { CaseStatusTypeDAO } from "../typesDAO.ts";

export interface CaseStatusDAO {
  idCase: number;
  statusNumber: number;
  status: CaseStatusTypeDAO;
  reason?: string;
  userId: string;
  registryDate: Date;
}
