import type { GenderType } from "#domain/mtypes.ts";
import type { GenderDAO, UserTypeDAO } from "#database/typesDAO.ts";
import type { UserDAO } from "#database/daos/userDAO.ts";
type UserType = "COORDINATOR" | "TEACHER" | "STUDENT";
export interface UserModel {
    identityCard: string;
    fullName: string;
    gender?: GenderType;
    email: string;
    password: string;
    isActive: boolean;
    type: UserType;
}

export function genderTypeDaoToModel(dao: GenderDAO): GenderType {
    switch (dao) {
        case "M":
            return "MALE";
        case "F":
            return "FEMALE";
    }
}

export function userTypeDaoToModel(dao: UserTypeDAO): UserType {
    switch (dao) {
        case "E":
            return "STUDENT";
        case "C":
            return "COORDINATOR";
        case "P":
            return "TEACHER";

    }
}

export function daoToUserModel(dao: UserDAO): UserModel {
    const { type, gender, ...rest } = dao;
    return {
        type: userTypeDaoToModel(type),
        gender: gender ? genderTypeDaoToModel(gender) : undefined,
        ...rest
    }
}