import type { ApplicantInfoDAO } from "#database/daos/applicantInfoDAO.ts";
import type { MaritalStatusDAO } from "#database/daos/typesDAO.ts";
import type { IdNacionality, MaritalStatus } from "#domain/mtypes.ts";
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
	headStudyTime?: string;
	applicantEducationLevel?: string;
	applicantStudyTime?: string;
	workConditionId?: number;
	activityConditionId?: number;
	memberCount?: number;
	workingMemberCount?: number;
	children7to12Count?: number;
	studentChildrenCount?: number;
	monthlyIncome?: string;
	bathroomCount?: number;
	bedroomCount?: number;
    headEducationLevelName?: string;
	workConditionName?: string;
	activityConditionName?: string;
	servicesIdAvailable?: number[];
}

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

export function daoToApplicantModel(dao: ApplicantInfoDAO): ApplicantModel {
    const {maritalStatus, createdAt, ...rest} = dao
    return {
        idNationality: dao.idNacionality as IdNacionality,
        maritalStatus: maritalStatus ? maritalStatusDAOToModel(maritalStatus) : undefined,
        createdAt: new Date(createdAt),
        ...rest,
    }

}