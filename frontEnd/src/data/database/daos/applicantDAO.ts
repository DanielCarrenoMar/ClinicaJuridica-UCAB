import type { BeneficiaryDAO } from "./beneficiaryDAO.ts";
import type { MaritalStatusTypeDTO } from "@app/shared/typesDTO";

export interface ApplicantDAO extends Omit<BeneficiaryDAO, 'hasId' | 'type'> {
	email?: string;
	cellPhone?: string;
	homePhone?: string;
	maritalStatus?: MaritalStatusTypeDTO;
	isConcubine?: boolean;
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