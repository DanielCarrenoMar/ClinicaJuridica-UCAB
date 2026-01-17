import type { UserModel } from "./user.ts";
import type { StudentDAO } from "#database/daos/studentDAO.ts";
import {
    typeDaoToGenderTypeModel,
    typeDaoToStudentTypeModel,
    typeModelToGenderTypeDao,
    typeModelToStudentTypeDao,
    type StudentTypeModel
} from "#domain/typesModel.ts";

export type { StudentTypeModel };

export interface StudentModel extends Omit<UserModel, 'type'> {
    term: string;
    nrc?: string;
    type: StudentTypeModel;
}

export function daoToStudentModel(dao: StudentDAO): StudentModel {
    const { type, gender, ...rest } = dao;
    return {
        type: typeDaoToStudentTypeModel(type),
        gender: gender ? typeDaoToGenderTypeModel(gender) : undefined,
        ...rest
    }
}

export function modelToStudentDao(model: StudentModel): StudentDAO {
    return {
        ...model,
        type: typeModelToStudentTypeDao(model.type),
        gender: model.gender ? typeModelToGenderTypeDao(model.gender) : undefined
    }
}