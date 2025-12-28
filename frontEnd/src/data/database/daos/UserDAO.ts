import type { GenderDAO, UserTypeDAO } from "./typesDAO.ts";

export interface UserDAO {
  identityCard: string;
  name: string;
  gender?: GenderDAO;
  email: string;
  password: string;
  isActive: boolean;
  type: UserTypeDAO;
}
