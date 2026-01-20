import type { ProcessTypeModel } from "#domain/typesModel.ts";
import { typeDaoToProcessTypeModel } from "#domain/typesModel.ts";
import type { CasesByServiceType } from "#database/daos/reports/casesByServiceTypeDAO.ts";

export interface CasesByServiceTypeModel {
  serviceType: ProcessTypeModel;
  count: number;
}

export function casesByServiceTypeDAOToModel(dao: CasesByServiceType): CasesByServiceTypeModel {
  return {
    serviceType: typeDaoToProcessTypeModel(dao.serviceType),
    count: dao.count,
  };
}
