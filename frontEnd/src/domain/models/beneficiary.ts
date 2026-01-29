import type { BeneficiaryInfoDAO } from "#database/daos/beneficiaryInfoDAO.ts";
import { typeDtoToBeneficiaryTypeModel, typeDtoToGenderTypeModel, type BeneficiaryTypeModel, type GenderTypeModel, type IdNacionalityTypeModel } from "#domain/typesModel.ts";


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
        type: typeDtoToBeneficiaryTypeModel(dao.type),
        gender: typeDtoToGenderTypeModel(dao.gender),
        birthDate: new Date(dao.birthDate)
    }
}