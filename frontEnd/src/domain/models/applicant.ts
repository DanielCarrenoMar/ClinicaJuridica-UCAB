import type { ApplicantDAO } from "#database/daos/applicantDAO.ts";
import type { ApplicantInfoDAO } from "#database/daos/applicantInfoDAO.ts";
import { typeDaoToGenderTypeModel, typeDaoToMaritalStatusTypeModel, typeModelToGenderTypeDao, typeModelToMaritalStatusTypeDao, type MaritalStatusTypeModel } from "#domain/mtypes.ts";
import type { BeneficiaryModel } from "./beneficiary";

export interface ApplicantModel extends Omit<BeneficiaryModel, 'hasId' | 'type'> {
	email?: string;
	cellPhone?: string;
	homePhone?: string;
	maritalStatus?: MaritalStatusTypeModel;
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

export function daoToApplicantModel(dao: ApplicantInfoDAO): ApplicantModel {
	const { maritalStatus, createdAt, gender, ...rest } = dao
	return {
		maritalStatus: maritalStatus ? typeDaoToMaritalStatusTypeModel(maritalStatus) : undefined,
		createdAt: new Date(createdAt),
		gender: typeDaoToGenderTypeModel(gender),
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
		gender: typeModelToGenderTypeDao(gender),
		maritalStatus: maritalStatus ? typeModelToMaritalStatusTypeDao(maritalStatus) : undefined
	}
}