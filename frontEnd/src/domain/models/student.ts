import type { UserModel } from "./user.ts";
import type { StudentTypeDAO } from "#database/typesDAO.ts";
import type { StudentDAO } from "#database/daos/studentDAO.ts";
import { genderTypeDaoToModel } from "./user.ts";
type StudentType = "REGULAR" | "VOLUNTEER" | "GRADUATE" | "SERVICE";

export interface StudentModel extends Omit<UserModel, 'type'> {
    term: string;
    nrc?: string;
    type: StudentType;
}

export function studentTypeDAOToModel(dao: StudentTypeDAO): StudentType {
    switch (dao) {
        case "R":
            return "REGULAR";
        case "V":
            return "VOLUNTEER";
        case "E":
            return "GRADUATE";
        case "S":
            return "SERVICE";
    }
}


export function daoToStudentModel(dao: StudentDAO): StudentModel {
    const { type, gender, nrc, ...rest } = dao;
    return {
        type: studentTypeDAOToModel(type),
        gender: gender ? genderTypeDaoToModel(gender) : null,
        nrc: nrc ?? null,
        ...rest

    }

}