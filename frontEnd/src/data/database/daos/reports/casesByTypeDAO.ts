import type { ProcessTypeDAO } from "#database/typesDAO.ts";

export interface CasesByType {
  type: ProcessTypeDAO;
  count: number;
}
