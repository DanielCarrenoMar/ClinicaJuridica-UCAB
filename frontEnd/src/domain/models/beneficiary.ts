import type { BeneficiaryInfoDAO } from "#database/daos/beneficiaryInfoDAO.ts";
import type { BeneficiaryTypeDAO } from "#database/typesDAO.ts";
import { typeDaoToGenderTypeModel, type GenderTypeModel, type IdNacionalityTypeModel } from "#domain/typesModel.ts";

type BeneficiaryType = "beneficiary" | "applicant";
export interface BeneficiaryModel {
    identityCard: string;
    gender: GenderTypeModel;
    birthDate: Date;
    fullName: string;
    idNationality: IdNacionalityTypeModel;
    hasId: boolean;
    type: BeneficiaryType;
    idState?: number;
    stateName?: string;
    municipalityNumber?: number;
    municipalityName?: string;
    parishNumber?: number;
    parishName?: string;
}

function beneficiaryTypeDAOtoModel(type: BeneficiaryTypeDAO): BeneficiaryType {
    switch (type) {
        case "B":
            return "beneficiary";
        case "S":
            return "applicant";
    }
}

export function daoToBeneficiaryModel(dao: BeneficiaryInfoDAO): BeneficiaryModel {
    return {
        ...dao,
        type: beneficiaryTypeDAOtoModel(dao.type),
        gender: typeDaoToGenderTypeModel(dao.gender),
        birthDate: new Date(dao.birthDate)
    }
}