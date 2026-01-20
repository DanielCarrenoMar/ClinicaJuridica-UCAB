import type{ StudentTypeDAO } from "#database/typesDAO.ts";

export interface StudentInvolvement {
  type: StudentTypeDAO;
  count: number;
}
