import type { GenderTypeDTO, UserTypeDTO } from "@app/shared/typesDTO";

export interface UserReqDTO {
    identityCard: string;
    fullName: string;
    gender?: GenderTypeDTO | null;
    email: string;
    isActive: boolean;
    type: UserTypeDTO;
}

export type UserResDTO  = UserReqDTO;