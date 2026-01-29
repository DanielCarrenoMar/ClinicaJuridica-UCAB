import type { CaseBeneficiaryDAO } from "#database/daos/caseBeneficiaryDAO.ts";
import type { CaseBeneficiaryInfoDAO } from "#database/daos/caseBeneficiaryInfoDAO.ts";
import { typeDtoToCaseBeneficiaryTypeModel, typeModelToCaseBeneficiaryTypeDto, type CaseBeneficiaryTypeModel} from "#domain/typesModel.ts";
import type { PersonModel } from "./person";

export interface CaseBeneficiaryModel extends PersonModel {
    idCase: number;
    caseType: CaseBeneficiaryTypeModel;
    description: string;
    relationship: string;
}

export function daoToCaseBeneficiaryModel(dao: CaseBeneficiaryInfoDAO): CaseBeneficiaryModel {
    return {
        ...dao,
        caseType: typeDtoToCaseBeneficiaryTypeModel(dao.caseType),
    }
}

export function caseBeneficiaryModelToDao(model: CaseBeneficiaryModel): CaseBeneficiaryDAO {
    return {
        ...model,
        caseType: typeModelToCaseBeneficiaryTypeDto(model.caseType),
    }
}