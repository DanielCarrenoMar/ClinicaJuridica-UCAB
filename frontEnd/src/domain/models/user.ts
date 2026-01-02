import { typeDaoToGenderTypeModel, type GenderTypeModel } from "#domain/mtypes.ts";
import type { UserTypeDAO } from "#database/typesDAO.ts";
import type { UserDAO } from "#database/daos/userDAO.ts";

type UserTypeModel = "coordinator" | "teacher" | "student";
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
            return "student";
        case "C":
            return "coordinator";
        case "P":
            return "teacher";
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