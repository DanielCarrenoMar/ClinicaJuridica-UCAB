import type{ TeacherTypeDAO } from "#database/typesDAO.ts";

export interface ProfessorInvolvement {
  type: TeacherTypeDAO;
  count: number;
}
