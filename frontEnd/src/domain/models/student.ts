import type { UserModel } from "./user.ts";
import type { StudentTypeDAO } from "#database/typesDAO.ts";
import type { StudentDAO } from "#database/daos/studentDAO.ts";
import { typeDaoToGenderTypeModel } from "#domain/typesModel.ts";

type StudentTypeModel = "regular" | "volunteer" | "graduate" | "service";
export interface StudentModel extends Omit<UserModel, 'type'> {
    term: string;
    nrc?: string;
    type: StudentTypeModel;
}

export function studentTypeDAOToModel(dao: StudentTypeDAO): StudentTypeModel {
    switch (dao) {
        case "R":
            return "regular";
        case "V":
            return "volunteer";
        case "E":
            return "graduate";
        case "S":
            return "service";
    }
}


export function daoToStudentModel(dao: StudentDAO): StudentModel {
    const { type, gender, ...rest } = dao;
    return {
        type: studentTypeDAOToModel(type),
        gender: gender ? typeDaoToGenderTypeModel(gender) : undefined,
        ...rest
    }
}