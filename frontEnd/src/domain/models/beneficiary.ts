import type { BeneficiaryInfoDAO } from "#database/daos/beneficiaryInfoDAO.ts";
import type { BeneficiaryTypeDAO } from "#database/typesDAO.ts";
import type { GenderTypeModel, IdNacionalityTypeModel } from "#domain/mtypes.ts";
import { genderTypeDaoToModel } from "./user";
type BeneficiaryType = "BENEFICIARY" | "APPLICANT";

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
            return "BENEFICIARY";
        case "S":
            return "APPLICANT";
    }
}

export function daoToBeneficiaryModel(dao: BeneficiaryInfoDAO): BeneficiaryModel {
    const { type, gender, ...rest } = dao;
    return {
        type: beneficiaryTypeDAOtoModel(type),
        gender: genderTypeDaoToModel(gender),
        ...rest
    }
}