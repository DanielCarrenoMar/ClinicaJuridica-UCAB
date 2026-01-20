import type{ ProcessTypeDAO } from "#database/typesDAO.ts";

export interface CasesByServiceType {
  serviceType: ProcessTypeDAO;
  count: number;
}
