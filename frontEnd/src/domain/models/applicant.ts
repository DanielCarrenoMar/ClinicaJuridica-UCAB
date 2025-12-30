import type { ApplicantDAO } from "#database/daos/applicantDAO.ts";
import type { MaritalStatusDAO } from "#database/daos/typesDAO.ts";
import type { MaritalStatus } from "#domain/mtypes.ts";
import type { BeneficiaryModel } from "./beneficiary";

export interface ApplicantModel extends Omit<BeneficiaryModel, 'hasId' | 'type'> {
    email?: string;
    cellPhone?: string;
    homePhone?: string;
    maritalStatus?: MaritalStatus;
    isConcubine?: boolean;
    createdAt: Date;
    isHeadOfHousehold?: boolean;
    headEducationLevelId?: number;
    headEducationLevel?: string;
    headStudyTime?: string;
    applicantEducationLevel?: string;
    applicantStudyTime?: string;
    workCondition?: string;
    activityCondition?: string;
    memberCount?: number;
    workingMemberCount?: number;
    children7to12Count?: number;
    studentChildrenCount?: number;
    monthlyIncome?: string;
    bathroomCount?: number;
    bedroomCount?: number;
}

export const defaultApplicantModel: Partial<ApplicantModel> = {
    identityCard: "",
    gender: undefined,
    birthDate: new Date(),
    fullName: "",
    idNationality: undefined,
    idState: undefined,
    stateName: "",
    municipalityNumber: undefined,
    municipalityName: "",
    parishNumber: undefined,
    parishName: "",
    email: "",
    cellPhone: "",
    homePhone: "",
    maritalStatus: undefined,
    isConcubine: false,
    createdAt: undefined,
    isHeadOfHousehold: false,
    headEducationLevelId: undefined,
    headEducationLevel: "",
    headStudyTime: "",
    applicantEducationLevel: "",
    applicantStudyTime: "",
    workCondition: "",
    activityCondition: "",
    memberCount: undefined,
    workingMemberCount: undefined,
    children7to12Count: undefined,
    studentChildrenCount: undefined,
    monthlyIncome: "",
    bathroomCount: undefined,
    bedroomCount: undefined
};

function maritalStatusDAOToModel(dao: MaritalStatusDAO): MaritalStatus {
    switch (dao) {
        case "S":
            return "single";
        case "C":
            return "married";
        case "D":
            return "divorced";
        case "V":
            return "widowed";
    }
}

export function daoToApplicantModel(applicantD: ApplicantDAO, familyHomeD: FamilyHomeDAO, housingD: HousingDAO , headEducationLevelD?: EducationLevelDAO, applicantEducationLevelD?: EducationLevelDAO, workConditionD?: WorkConditionDAO, activityConditionD?: ActivityConditionDAO, stateD?: StateDAO, municipalityD?: MunicipalityDAO, parishD?: ParishDAO): ApplicantModel {
    return {
        identityCard: applicantD.identityCard,
        gender: applicantD.gender,
        birthDate: applicantD.birthDate,
        fullName: applicantD.name,
        idNationality: applicantD.idNacionality,
        idState: applicantD.idState,
        stateName: stateD?.name,
        municipalityNumber: applicantD.municipalityNumber,
        municipalityName: municipalityD?.name,
        parishNumber: applicantD.parishNumber,
        parishName: parishD?.name,
        email: applicantD.email,
        cellPhone: applicantD.cellPhone,
        homePhone: applicantD.homePhone,
        maritalStatus: applicantD.maritalStatus ? maritalStatusDAOToModel(applicantD.maritalStatus) : undefined,
        isConcubine: applicantD.isConcubine,
        createdAt: applicantD.createdAt,
        isHeadOfHousehold: applicantD.isHeadOfHousehold,
        headEducationLevelId: applicantD.headEducationLevelId,
        headEducationLevel: headEducationLevelD?.name,
        headStudyTime: applicantD.headStudyTime,
        applicantEducationLevel: applicantEducationLevelD?.name,
        applicantStudyTime: applicantD.applicantStudyTime,
        workCondition: workConditionD?.name,
        activityCondition: activityConditionD?.name,
        memberCount: familyHomeD.memberCount,
        workingMemberCount: familyHomeD.workingMemberCount,
        children7to12Count: familyHomeD.children7to12Count,
        studentChildrenCount: familyHomeD.studentChildrenCount,
        monthlyIncome: familyHomeD.monthlyIncome,
        bathroomCount: housingD.bathroomCount,
        bedroomCount: housingD.bedroomCount,
    }

}