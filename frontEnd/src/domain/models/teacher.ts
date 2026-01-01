import type { UserModel } from "./user";
import type { TeacherTypeDAO } from "#database/typesDAO.ts";
import type { TeacherDAO } from "#database/daos/teacherDAO.ts";
import { genderTypeDaoToModel } from "./user";
type TeacherType = "REGULAR" | "VOLUNTEER";
export interface TeacherModel extends Omit<UserModel, 'type'> {
    term: string;
    type: TeacherType;
}

export function teacherTypeDAOToModel(dao: TeacherTypeDAO): TeacherType {
    switch (dao) {
        case "R":
            return "REGULAR";
        case "V":
            return "VOLUNTEER";
    }
}

export function daoToTeacherModel(dao: TeacherDAO): TeacherModel {
    const { type, gender, ...rest } = dao;
    return {
        type: teacherTypeDAOToModel(type),
        gender: gender ? genderTypeDaoToModel(gender) : null,
        ...rest

    }

}