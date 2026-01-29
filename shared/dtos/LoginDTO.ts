import type { GenderTypeDTO, UserTypeDTO } from "../typesDTO";

export interface LoginReqDTO {
    email: string;
    password: string;
}

export interface LoginResDTO {
    identityCard: string;
    fullName: string;
    gender: GenderTypeDTO | null;
    email: string;
    password: string;
    isActive: boolean;
    type: UserTypeDTO;
}