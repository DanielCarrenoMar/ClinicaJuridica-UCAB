import type { ApplicantDAO } from "./applicantDAO.ts";

export interface ApplicantInfoDAO extends ApplicantDAO {
	headEducationLevelName?: string;
	workConditionName?: string;
	activityConditionName?: string;
	servicesAvailable?: string[];
}