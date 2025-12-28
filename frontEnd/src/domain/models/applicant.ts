import type { IdNacionality, MaritalStatus, SexType } from "#domain/mtypes.ts";

export interface ApplicantModel{
    identityCard: string;
    gender: SexType;
    birthDate: Date;
    fullName: string;
    idNationality: IdNacionality;
    email: string;
    cellPhone: string;
    homePhone: string;
    maritalStatus?: MaritalStatus;
    isConcubine?: boolean;
    createdAt: Date;
    isHeadOfHousehold?: boolean;
    headEducationLevelId?: number;
    headEducationLevel?: string;
    headStudyTime?: string;
    applicantEducationLevel: string;
    applicantStudyTime: string;
    workCondition: string;
    activityCondition: string;
    idState?: number;
    stateName?: string;
    municipalityNumber?: number;
    municipalityName?: string;
    parishNumber?: number;
    parishName?: string;
    neighborhood?: string;
    address?: string;
    housingCondition?: string;
    housingType?: string;
    tenureType?: string;
    servicesAvailable?: string[];
    householdSize?: number;
    minorsCount?: number;
    seniorsCount?: number;
    disabledCount?: number;
    pregnantCount?: number;
    householdIncome?: string;
}

export const defaultApplicantModel: ApplicantModel = {
    identityCard: "",
    gender: "M",
    birthDate: new Date(),
    fullName: "",
    idNationality: "V",
    email: "",
    cellPhone: "",
    homePhone: "",
    maritalStatus: undefined,
    isConcubine: false,
    createdAt: new Date(),
    isHeadOfHousehold: false,
    headEducationLevelId: undefined,
    headEducationLevel: "",
    headStudyTime: "",
    applicantEducationLevel: "",
    applicantStudyTime: "",
    workCondition: "",
    activityCondition: "",
    idState: undefined,
    stateName: "",
    municipalityNumber: undefined,
    municipalityName: "",
    parishNumber: undefined,
    parishName: "",
    neighborhood: "",
    address: "",
    housingCondition: "",
    housingType: "",
    tenureType: "",
    servicesAvailable: [],
    householdSize: undefined,
    minorsCount: undefined,
    seniorsCount: undefined,
    disabledCount: undefined,
    pregnantCount: undefined,
    householdIncome: "",
};