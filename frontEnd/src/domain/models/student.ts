import type { UserModel } from "./user.ts";
import type { StudentDAO } from "#database/daos/studentDAO.ts";
import {
    typeDtoToGenderTypeModel,
    typeDtoToStudentTypeModel,
    typeModelToGenderTypeDto,
    typeModelToStudentTypeDto,
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
        type: typeDtoToStudentTypeModel(type),
        gender: gender ? typeDtoToGenderTypeModel(gender) : undefined,
        ...rest
    }
}

export function modelToStudentDao(model: StudentModel): StudentDAO {
    return {
        ...model,
        type: typeModelToStudentTypeDto(model.type),
        gender: model.gender ? typeModelToGenderTypeDto(model.gender) : undefined
    }
}