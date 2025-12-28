import type { MaritalStatusDAO } from "./typesDAO.ts";

export interface ApplicantDAO {
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