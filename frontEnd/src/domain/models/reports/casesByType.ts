import type { ProcessTypeModel } from "#domain/typesModel.ts";
import { typeDtoToProcessTypeModel } from "#domain/typesModel.ts";
import type { CasesByType } from "#database/daos/reports/casesByTypeDAO.ts";

export interface CasesByTypeModel {
  type: ProcessTypeModel;
  count: number;
}

export function casesByTypeDAOToModel(dao: CasesByType): CasesByTypeModel {
  return {
    type: typeDtoToProcessTypeModel(dao.type),
    count: dao.count,
  };
}
