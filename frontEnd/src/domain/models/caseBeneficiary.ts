import type { CaseBeneficiaryInfoDAO } from "#database/daos/caseBeneficiaryInfoDAO.ts";
import { typeDaoToCaseBeneficiaryTypeModel, type CaseBeneficiaryTypeModel } from "#domain/typesModel.ts";
import type { PersonModel } from "./person";

export interface CaseBeneficiaryModel extends PersonModel {
    caseType: CaseBeneficiaryTypeModel;
    description: string;
    relationship: string;
}

export function daoToCaseBeneficiaryModel(dao: CaseBeneficiaryInfoDAO): CaseBeneficiaryModel {
    return {
        ...dao,
        caseType: typeDaoToCaseBeneficiaryTypeModel(dao.caseType),
    }
}