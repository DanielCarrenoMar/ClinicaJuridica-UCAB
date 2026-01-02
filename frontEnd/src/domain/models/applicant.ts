import type { ApplicantDAO } from "#database/daos/applicantDAO.ts";
import type { ApplicantInfoDAO } from "#database/daos/applicantInfoDAO.ts";
import type { MaritalStatusDAO } from "#database/typesDAO.ts";
import { modelGenderToDao, type MaritalStatus } from "#domain/mtypes.ts";
import type { BeneficiaryModel } from "./beneficiary";
import { genderTypeDaoToModel } from "./user";
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
function modelToMaritalStatusDAO(model: MaritalStatus): MaritalStatusDAO {
	switch (model) {
		case "single":
			return "S";
		case "married":
			return "C";
		case "divorced":
			return "D";
		case "widowed":
			return "V";
	}
}

export function daoToApplicantModel(dao: ApplicantInfoDAO): ApplicantModel {
	const { maritalStatus, createdAt, gender, ...rest } = dao
	return {
		maritalStatus: maritalStatus ? maritalStatusDAOToModel(maritalStatus) : undefined,
		createdAt: new Date(createdAt),
		gender: genderTypeDaoToModel(gender),
		...rest,
	}
}

export function modelToApplicantDao(model: ApplicantModel): ApplicantDAO {
	const {
		maritalStatus,
		createdAt,
		headEducationLevelName,
		workConditionName,
		activityConditionName,
		servicesIdAvailable,
		gender,
		...rest} = model;
	return {
		...rest,
		gender: modelGenderToDao(gender),
		maritalStatus: maritalStatus ? modelToMaritalStatusDAO(maritalStatus) : undefined
	}
}