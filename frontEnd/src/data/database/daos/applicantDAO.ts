import type { MaritalStatusDAO } from "./typesDAO.ts";
import type { BeneficiaryDAO } from "./BeneficiaryDAO.ts";

export interface ApplicantDAO extends Omit<BeneficiaryDAO, 'hasId' | 'type' | 'identityCard'> {
	identityCard: string;
	email?: string;
	cellPhone?: string;
	homePhone?: string;
	maritalStatus?: MaritalStatusDAO;
	isConcubine?: boolean;
	createdAt: Date;
	isHeadOfHousehold?: boolean;
	headEducationLevelId?: number;
	headStudyTime?: string;
	applicantEducationLevelId?: number;
	applicantStudyTime?: string;
	workConditionId?: number;
	activityConditionId?: number;
}