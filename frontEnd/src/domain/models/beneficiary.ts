import type { BeneficiaryInfoDAO } from "#database/daos/beneficiaryInfoDAO.ts";
import type { BeneficiaryTypeDAO } from "#database/typesDAO.ts";
import type { PersonID, GenderType, IdNacionality } from "#domain/mtypes.ts";
import { genderTypeDaoToModel } from "./user";
type BeneficiaryType = "BENEFICIARY" | "APPLICANT";

export interface BeneficiaryModel {
    identityCard: PersonID;
    gender: GenderType;
    birthDate: Date;
    fullName: string;
    idNationality: IdNacionality;
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
        default:
            throw new Error(`Unknown BeneficiaryTypeDAO: ${type}`);
    }
}

export function daoToBeneficiaryModel(dao: BeneficiaryInfoDAO): BeneficiaryModel {
    const { idNacionality, type, gender, ...rest } = dao;
    return {
        idNationality: idNacionality,
        type: beneficiaryTypeDAOtoModel(type),
        gender: genderTypeDaoToModel(gender),
        ...rest
    }
}