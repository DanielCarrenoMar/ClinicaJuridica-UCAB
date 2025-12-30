import type { TeacherTypeDAO } from "./typesDAO.ts";
export interface TeacherDAO {
  identityCard: string;
  term: string;
  type: TeacherTypeDAO;
}
