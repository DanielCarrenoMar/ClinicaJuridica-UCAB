import type { GenderTypeDAO, UserTypeDAO } from "../typesDAO"

export interface LoginRequestDAO {
  email: string;
  password: string;
}

export interface LoginResponseDAO {
  identityCard: string;
  fullName: string;
  gender?: GenderTypeDAO;
  email: string;
  password: string;
  isActive: boolean;
  type: UserTypeDAO;
}
