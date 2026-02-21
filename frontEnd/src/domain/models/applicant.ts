import type { ApplicantDAO } from "#database/daos/applicantDAO.ts";
import type { ApplicantInfoDAO } from "#database/daos/applicantInfoDAO.ts";
import { typeDtoToGenderTypeModel, typeDtoToMaritalStatusTypeModel, typeModelToGenderTypeDto, typeModelToIdNationalityTypeDto, typeModelToMaritalStatusTypeDto, type MaritalStatusTypeModel } from "#domain/typesModel.ts";
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
	applicantEducationLevel?: number;
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
	houseType?: number;
	floorMaterial?: number;
	wallMaterial?: number;
	roofMaterial?: number;
	potableWaterService?: number;
	sewageService?: number;
	cleaningService?: number;
}

export function daoToApplicantModel(dao: ApplicantInfoDAO): ApplicantModel {
	return {
		...dao,
		maritalStatus: dao.maritalStatus ? typeDtoToMaritalStatusTypeModel(dao.maritalStatus) : undefined,
		createdAt: new Date(dao.createdAt),
		gender: typeDtoToGenderTypeModel(dao.gender),
		birthDate: new Date(dao.birthDate)
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
		birthDate,
		...rest } = model;
	const daoBase = rest as unknown as Omit<ApplicantDAO, 'gender' | 'maritalStatus' | 'birthDate'>;
	return {
		...daoBase,
		birthDate: birthDate.toISOString(),
		gender: typeModelToGenderTypeDto(gender),
		maritalStatus: maritalStatus ? typeModelToMaritalStatusTypeDto(maritalStatus) : undefined,
		servicesIdAvailable: servicesIdAvailable,
		idNationality: typeModelToIdNationalityTypeDto(model.idNationality)
	};
}