import type { TeacherTypeModel } from "#domain/typesModel.ts";
import { typeDaoToTeacherTypeModel } from "#domain/typesModel.ts";
import type { ProfessorInvolvement } from "#database/daos/reports/professorInvolvementDAO.ts";

export interface ProfessorInvolvementModel {
  type: TeacherTypeModel;
  count: number;
}

export function professorInvolvementDAOToModel(dao: ProfessorInvolvement): ProfessorInvolvementModel {
  return {
    type: typeDaoToTeacherTypeModel(dao.type),
    count: dao.count,
  };
}
