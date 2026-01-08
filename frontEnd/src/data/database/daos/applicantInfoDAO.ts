import type { ApplicantDAO } from "./applicantDAO.ts";

export interface ApplicantInfoDAO extends ApplicantDAO {
	identityCard: string;
	headEducationLevelName?: string;
	workConditionName?: string;
	activityConditionName?: string;
	servicesIdAvailable?: number[];
	houseType?: string;
	floorMaterial?: string;
	wallMaterial?: string;
	roofMaterial?: string;
	potableWaterService?: string;
	sewageService?: string;
	cleaningService?: string;
	createdAt: string;
}