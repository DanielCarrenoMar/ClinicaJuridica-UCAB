import type { ApplicantDAO } from "./applicantDAO.ts";

export interface ApplicantInfoDAO extends ApplicantDAO {
	identityCard: string;
	headEducationLevelName?: string;
	workConditionName?: string;
	activityConditionName?: string;
	servicesIdAvailable?: number[];
	createdAt: string;
}