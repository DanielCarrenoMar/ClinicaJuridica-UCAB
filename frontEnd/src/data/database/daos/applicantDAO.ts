import type { BeneficiaryDAO } from "./beneficiaryDAO.ts";
import type { MaritalStatusDAO } from "./typesDAO.ts";

export interface ApplicantDAO extends Omit<BeneficiaryDAO, 'hasId' | 'type'> {
	email?: string;
	cellPhone?: string;
	homePhone?: string;
	maritalStatus?: MaritalStatusDAO;
	isConcubine?: boolean;
	createdAt: string;
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
}