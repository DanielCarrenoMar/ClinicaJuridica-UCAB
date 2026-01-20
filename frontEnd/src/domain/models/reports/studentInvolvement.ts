import type { StudentTypeModel } from "#domain/typesModel.ts";
import { typeDaoToStudentTypeModel } from "#domain/typesModel.ts";
import type { StudentInvolvement } from "#database/daos/reports/studentInvolvementDAO.ts";

export interface StudentInvolvementModel {
  type: StudentTypeModel;
  count: number;
}

export function studentInvolvementDAOToModel(dao: StudentInvolvement): StudentInvolvementModel {
  return {
    type: typeDaoToStudentTypeModel(dao.type),
    count: dao.count,
  };
}
