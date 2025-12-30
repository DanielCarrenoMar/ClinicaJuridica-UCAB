import type { MaritalStatusDAO } from "./typesDAO.ts";
import type { BeneficiaryDAO } from "./BeneficiaryDAO.ts";

export interface ApplicantDAO extends Omit<BeneficiaryDAO, 'hasId' | 'type'> {
	email?: string;
	cellPhone?: string;
	homePhone?: string;
	maritalStatus?: MaritalStatusDAO;
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