import type { CaseBeneficiaryInfoDAO } from "#database/daos/caseBeneficiaryInfoDAO.ts";
import { typeDaoToBeneficiaryTypeModel, typeDaoToCaseBeneficiaryTypeModel, typeDaoToGenderTypeModel, type CaseBeneficiaryTypeModel, type GenderTypeModel, type IdNacionalityTypeModel } from "#domain/typesModel.ts";
import type { BeneficiaryModel } from "./beneficiary";

export interface CaseBeneficiaryModel extends BeneficiaryModel {
    caseType: CaseBeneficiaryTypeModel;
    description: string;
    relationship: string;
}

export function daoToCaseBeneficiaryModel(dao: CaseBeneficiaryInfoDAO): CaseBeneficiaryModel {
    return {
        ...dao,
        type: typeDaoToBeneficiaryTypeModel(dao.type),
        caseType: typeDaoToCaseBeneficiaryTypeModel(dao.caseType),
        gender: typeDaoToGenderTypeModel(dao.gender),
        birthDate: new Date(dao.birthDate)
    }
}