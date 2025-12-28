import type { StudentTypeDAO } from "./typesDAO.ts";

export interface StudentDAO {
  identityCard: string;
  term: string;
  nrc?: string;
  type: StudentTypeDAO;
}
