import type { ApplicantDAO } from "./applicantDAO.ts";

export interface ApplicantInfoDAO extends ApplicantDAO {
	identityCard: string;
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
	createdAt: string;
}