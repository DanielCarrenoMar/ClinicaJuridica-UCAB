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
    headStudyTime?: string;
    applicantEducationLevel: string;
    applicantStudyTime: string;
    workCondition: string;
    activityCondition: string;
    idState?: number;
    municipalityNumber?: number;
    parishNumber?: number;
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
    headStudyTime: "",
    applicantEducationLevel: "",
    applicantStudyTime: "",
    workCondition: "",
    activityCondition: "",
    idState: undefined,
    municipalityNumber: undefined,
    parishNumber: undefined,
};