import type { CaseStatusEnumDAO } from "./typesDAO.ts";

export interface CaseStatusDAO {
  idCase: number;
  statusNumber: number;
  status: CaseStatusEnumDAO;
  reason?: string;
  userId: string;
  registryDate: Date;
}
