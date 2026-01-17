import type { UserModel } from "./user.ts";
import type { TeacherDAO } from "#database/daos/teacherDAO.ts";
import {
    typeDaoToGenderTypeModel,
    typeDaoToTeacherTypeModel,
    typeModelToGenderTypeDao,
    typeModelToTeacherTypeDao,
    type TeacherTypeModel
} from "#domain/typesModel.ts";

export type { TeacherTypeModel };

export interface TeacherModel extends Omit<UserModel, 'type'> {
    term: string;
    type: TeacherTypeModel;
}

export function daoToTeacherModel(dao: TeacherDAO): TeacherModel {
    const { type, gender, ...rest } = dao;
    return {
        type: typeDaoToTeacherTypeModel(type),
        gender: gender ? typeDaoToGenderTypeModel(gender) : undefined,
        ...rest
    }
}

export function modelToTeacherDao(model: TeacherModel): TeacherDAO {
    return {
        ...model,
        type: typeModelToTeacherTypeDao(model.type),
        gender: model.gender ? typeModelToGenderTypeDao(model.gender) : undefined
    }
}
