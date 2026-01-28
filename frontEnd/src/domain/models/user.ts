import { 
    typeDaoToGenderTypeModel, 
    typeModelToGenderTypeDao,
    type GenderTypeModel,
    typeModelToUserTypeDao,
    type UserTypeModel,
    typeDtoToUserTypeModel
} from "#domain/typesModel.ts";
import type { UserDAO } from "#database/daos/userDAO.ts";

export type { UserTypeModel };

export interface UserModel {
    identityCard: string;
    fullName: string;
    gender?: GenderTypeModel;
    email: string;
    password: string;
    isActive: boolean;
    type: UserTypeModel;
}

export function daoToUserModel(dao: UserDAO): UserModel {
    const { type, gender, ...rest } = dao;
    return {
        type: typeDtoToUserTypeModel(type),
        gender: gender ? typeDaoToGenderTypeModel(gender) : undefined,
        ...rest
    }
}

export function modelToUserDao(model: UserModel): UserDAO {
    const { type, gender, ...rest } = model;
    return {
        ...rest,
        type: typeModelToUserTypeDao(type),
        gender: gender ? typeModelToGenderTypeDao(gender) : undefined
    }
}
