import type { BeneficiaryDAO } from "./beneficiaryDAO.ts";
import type { MaritalStatusTypeDAO } from "../typesDAO.ts";

export interface ApplicantDAO extends Omit<BeneficiaryDAO, 'hasId' | 'type'> {
	email?: string;
	cellPhone?: string;
	homePhone?: string;
	maritalStatus?: MaritalStatusTypeDAO;
	isConcubine?: boolean;
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
	servicesIdAvailable?: number[];
	studentChildrenCount?: number;
	monthlyIncome?: string;
	bathroomCount?: number;
	bedroomCount?: number;
	houseType?: number;
	floorMaterial?: number;
	wallMaterial?: number;
	roofMaterial?: number;
	potableWaterService?: number;
	sewageService?: number;
	cleaningService?: number;
}