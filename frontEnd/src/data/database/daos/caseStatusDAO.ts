import type { CaseStatusTypeDTO } from "../typesDAO.ts";

export interface CaseStatusDAO {
  status: CaseStatusTypeDTO;
  reason?: string;
  userId: string;
}
