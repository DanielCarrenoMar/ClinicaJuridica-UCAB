import type { StudentTypeModel } from "#domain/typesModel.ts";
import { typeDtoToStudentTypeModel } from "#domain/typesModel.ts";
import type { StudentInvolvement } from "#database/daos/reports/studentInvolvementDAO.ts";

export interface StudentInvolvementModel {
  type: StudentTypeModel;
  count: number;
}

export function studentInvolvementDAOToModel(dao: StudentInvolvement): StudentInvolvementModel {
  return {
    type: typeDtoToStudentTypeModel(dao.type),
    count: dao.count,
  };
}
