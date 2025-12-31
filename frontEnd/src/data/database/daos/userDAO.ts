import type { GenderDAO, UserTypeDAO } from "../typesDAO"

export interface UserDAO {
    identityCard: string;
    fullname: string;
    gender?: GenderDAO;
    email: string;
    password: string;
    isActive: boolean;
    type: UserTypeDAO;
}