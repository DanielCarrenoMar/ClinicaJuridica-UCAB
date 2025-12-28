import type { PersonID, SexType, IdNacionality } from "#domain/mtypes.ts";

type BeneficiaryType = "BENEFICIARY" | "APPLICANT";

export interface BeneficiaryModel {
    identityCard: PersonID;
    gender: SexType;
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