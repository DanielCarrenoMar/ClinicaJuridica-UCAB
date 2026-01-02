import type { UserModel } from "./user";
import type { TeacherTypeDAO } from "#database/typesDAO.ts";
import type { TeacherDAO } from "#database/daos/teacherDAO.ts";
import { typeDaoToGenderTypeModel } from "#domain/mtypes.ts";

type TeacherTypeModel = "regular" | "volunteer";
export interface TeacherModel extends Omit<UserModel, 'type'> {
    term: string;
    type: TeacherTypeModel;
}

export function typeDaoToTeacherTypeModel(dao: TeacherTypeDAO): TeacherTypeModel {
    switch (dao) {
        case "R":
            return "regular";
        case "V":
            return "volunteer";
    }
}

export function daoToTeacherModel(dao: TeacherDAO): TeacherModel {
    const { type, gender, ...rest } = dao;
    return {
        type: typeDaoToTeacherTypeModel(type),
        gender: gender ? typeDaoToGenderTypeModel(gender) : undefined,
        ...rest
    }
}