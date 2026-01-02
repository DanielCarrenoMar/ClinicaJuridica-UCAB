import type { GenderTypeDAO, UserTypeDAO } from "../typesDAO"

export interface UserDAO {
    identityCard: string;
    fullName: string;
    gender?: GenderTypeDAO;
    email: string;
    password: string;
    isActive: boolean;
    type: UserTypeDAO;
}