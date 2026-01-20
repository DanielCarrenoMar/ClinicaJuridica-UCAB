import type { ProcessTypeModel } from "#domain/typesModel.ts";
import { typeDaoToProcessTypeModel } from "#domain/typesModel.ts";
import type { CasesByType } from "#database/daos/reports/casesByTypeDAO.ts";

export interface CasesByTypeModel {
  type: ProcessTypeModel;
  count: number;
}

export function casesByTypeDAOToModel(dao: CasesByType): CasesByTypeModel {
  return {
    type: typeDaoToProcessTypeModel(dao.type),
    count: dao.count,
  };
}
