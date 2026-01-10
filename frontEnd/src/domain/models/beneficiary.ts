import type { BeneficiaryInfoDAO } from "#database/daos/beneficiaryInfoDAO.ts";
import { typeDaoToBeneficiaryTypeModel, typeDaoToGenderTypeModel, type BeneficiaryTypeModel, type GenderTypeModel, type IdNacionalityTypeModel } from "#domain/typesModel.ts";


export interface BeneficiaryModel {
    identityCard: string;
    gender: GenderTypeModel;
    birthDate: Date;
    fullName: string;
    idNationality: IdNacionalityTypeModel;
    hasId: boolean;
    type: BeneficiaryTypeModel;
    idState?: number;
    stateName?: string;
    municipalityNumber?: number;
    municipalityName?: string;
    parishNumber?: number;
    parishName?: string;
}

export function daoToBeneficiaryModel(dao: BeneficiaryInfoDAO): BeneficiaryModel {
    return {
        ...dao,
        type: typeDaoToBeneficiaryTypeModel(dao.type),
        gender: typeDaoToGenderTypeModel(dao.gender),
        birthDate: new Date(dao.birthDate)
    }
}