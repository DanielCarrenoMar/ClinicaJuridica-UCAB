import type { GenderTypeDTO, UserTypeDTO } from "../typesDAO"

export interface UserDAO {
    identityCard: string;
    fullName: string;
    gender?: GenderTypeDTO;
    email: string;
    password: string;
    isActive: boolean;
    type: UserTypeDTO;
}