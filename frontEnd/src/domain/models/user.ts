import { typeDaoToGenderTypeModel, type GenderTypeModel } from "#domain/typesModel.ts";
import type { UserTypeDAO } from "#database/typesDAO.ts";
import type { UserDAO } from "#database/daos/userDAO.ts";

export type UserTypeModel = "Coordinador" | "Profesor" | "Estudiante";
export interface UserModel {
    identityCard: string;
    fullName: string;
    gender?: GenderTypeModel;
    email: string;
    password: string;
    isActive: boolean;
    type: UserTypeModel;
}

export function userTypeDaoToModel(dao: UserTypeDAO): UserTypeModel {
    switch (dao) {
        case "E":
            return "Estudiante";
        case "C":
            return "Coordinador";
        case "P":
            return "Profesor";
    }
}

export function daoToUserModel(dao: UserDAO): UserModel {
    const { type, gender, ...rest } = dao;
    return {
        type: userTypeDaoToModel(type),
        gender: gender ? typeDaoToGenderTypeModel(gender) : undefined,
        ...rest
    }
}