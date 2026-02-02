import { 
    typeDtoToGenderTypeModel, 
    typeModelToGenderTypeDto,
    type GenderTypeModel,
    typeModelToUserTypeDto,
    type UserTypeModel,
    typeDtoToUserTypeModel
} from "#domain/typesModel.ts";
import type { UserResDTO } from "@app/shared/dtos/UserDTO";

export type { UserTypeModel };

export interface UserModel {
    identityCard: string;
    fullName: string;
    gender?: GenderTypeModel;
    email: string;
    isActive: boolean;
    type: UserTypeModel;
}

export function dtoToUserModel(dto: UserResDTO): UserModel {
    const { type, gender, ...rest } = dto;
    return {
        type: typeDtoToUserTypeModel(type),
        gender: gender ? typeDtoToGenderTypeModel(gender) : undefined,
        ...rest
    }
}

export function modelToUserDto(model: UserModel): UserResDTO {
    const { type, gender, ...rest } = model;
    return {
        ...rest,
        type: typeModelToUserTypeDto(type),
        gender: gender ? typeModelToGenderTypeDto(gender) : undefined
    }
}
