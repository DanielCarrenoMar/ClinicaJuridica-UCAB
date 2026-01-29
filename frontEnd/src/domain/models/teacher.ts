import type { UserModel } from "./user.ts";
import type { TeacherDAO } from "#database/daos/teacherDAO.ts";
import {
    typeDtoToGenderTypeModel,
    typeDtoToTeacherTypeModel,
    typeModelToGenderTypeDto,
    typeModelToTeacherTypeDto,
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
        type: typeDtoToTeacherTypeModel(type),
        gender: gender ? typeDtoToGenderTypeModel(gender) : undefined,
        ...rest
    }
}

export function modelToTeacherDao(model: TeacherModel): TeacherDAO {
    return {
        ...model,
        type: typeModelToTeacherTypeDto(model.type),
        gender: model.gender ? typeModelToGenderTypeDto(model.gender) : undefined
    }
}
