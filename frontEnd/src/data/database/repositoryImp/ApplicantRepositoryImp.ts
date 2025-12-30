import type { ApplicantRepository } from "../../../domain/repositories";
import type { ApplicantDAO } from "../daos/applicantDAO";
import { daoToApplicantModel } from "#domain/models/applicant.ts";
import type { StateDAO } from "../daos/StateDAO";
import type { MunicipalityDAO } from "../daos/MunicipalityDAO";
import type { ParishDAO } from "../daos/ParishDAO";
import type { EducationLevelDAO } from "../daos/EducationLevelDAO";
import type { WorkConditionDAO } from "../daos/WorkConditionDAO";
import type { ActivityConditionDAO } from "../daos/ActivityConditionDAO";
import type { FamilyHomeDAO } from "../daos/FamilyHomeDAO";
import type { HousingDAO } from "../daos/HousingDAO";
import {
    APPLICANT_URL,
    STATE_URL,
    MUNICIPALITY_URL,
    PARISH_URL,
    EDUCATION_LEVEL_URL,
    WORK_CONDITION_URL,
    ACTIVITY_CONDITION_URL,
    FAMILY_HOME_URL,
    HOUSING_URL
} from "./apiUrl";

export function getApplicantRepository(): ApplicantRepository {
    return {
        findAllApplicants: async () => {
            const responseApplicant = await fetch(APPLICANT_URL);
            const applicantsData = await responseApplicant.json();
            const applicantDAOs: ApplicantDAO[] = applicantsData.data;

            const applicantsWithAllData = await Promise.all(
                applicantDAOs.map(async (applicantDao) => {
                    // Fetch State
                    const stateResponse = await fetch(`${STATE_URL}/${applicantDao.idState}`);
                    const stateData = await stateResponse.json();
                    const stateDao: StateDAO = stateData.data;

                    // Fetch Municipality
                    const municipalityResponse = await fetch(`${MUNICIPALITY_URL}/${applicantDao.municipalityNumber}`);
                    const municipalityData = await municipalityResponse.json();
                    const municipalityDao: MunicipalityDAO = municipalityData.data;

                    // Fetch Parish
                    const parishResponse = await fetch(`${PARISH_URL}/${applicantDao.parishNumber}`);
                    const parishData = await parishResponse.json();
                    const parishDao: ParishDAO = parishData.data;

                    // Fetch Head Education Level
                    const headEducationResponse = await fetch(`${EDUCATION_LEVEL_URL}/${applicantDao.headEducationLevelId}`);
                    const headEducationData = await headEducationResponse.json();
                    const headEducationDao: EducationLevelDAO = headEducationData.data;

                    // Fetch Applicant Education Level
                    const applicantEducationResponse = await fetch(`${EDUCATION_LEVEL_URL}/${applicantDao.applicantEducationLevelId}`);
                    const applicantEducationData = await applicantEducationResponse.json();
                    const applicantEducationDao: EducationLevelDAO = applicantEducationData.data;

                    // Fetch Work Condition
                    const workConditionResponse = await fetch(`${WORK_CONDITION_URL}/${applicantDao.workConditionId}`);
                    const workConditionData = await workConditionResponse.json();
                    const workConditionDao: WorkConditionDAO = workConditionData.data;

                    // Fetch Activity Condition
                    const activityConditionResponse = await fetch(`${ACTIVITY_CONDITION_URL}/${applicantDao.activityConditionId}`);
                    const activityConditionData = await activityConditionResponse.json();
                    const activityConditionDao: ActivityConditionDAO = activityConditionData.data;

                    // Fetch Family Home
                    const familyHomeResponse = await fetch(`${FAMILY_HOME_URL}/${applicantDao.identityCard}`);
                    const familyHomeData = await familyHomeResponse.json();
                    const familyHomeDao: FamilyHomeDAO = familyHomeData.data;

                    // Fetch Housing
                    const housingResponse = await fetch(`${HOUSING_URL}/${applicantDao.identityCard}`);
                    const housingData = await housingResponse.json();
                    const housingDao: HousingDAO = housingData.data;

                    return daoToApplicantModel(
                        applicantDao,
                        stateDao,
                        municipalityDao,
                        parishDao,
                        headEducationDao,
                        applicantEducationDao,
                        workConditionDao,
                        activityConditionDao,
                        familyHomeDao,
                        housingDao
                    );
                })
            );

            return applicantsWithAllData;
        },

        findApplicantById: async (id) => {
            const response = await fetch(`${APPLICANT_URL}/${id}`);
            if (!response.ok) return null;
            const applicantData = await response.json();
            const applicantDao: ApplicantDAO = applicantData.data;

            // Fetch State
            const stateResponse = await fetch(`${STATE_URL}/${applicantDao.idState}`);
            const stateData = await stateResponse.json();
            const stateDao: StateDAO = stateData.data;

            // Fetch Municipality
            const municipalityResponse = await fetch(`${MUNICIPALITY_URL}/${applicantDao.municipalityNumber}`);
            const municipalityData = await municipalityResponse.json();
            const municipalityDao: MunicipalityDAO = municipalityData.data;

            // Fetch Parish
            const parishResponse = await fetch(`${PARISH_URL}/${applicantDao.parishNumber}`);
            const parishData = await parishResponse.json();
            const parishDao: ParishDAO = parishData.data;

            // Fetch Head Education Level
            const headEducationResponse = await fetch(`${EDUCATION_LEVEL_URL}/${applicantDao.headEducationLevelId}`);
            const headEducationData = await headEducationResponse.json();
            const headEducationDao: EducationLevelDAO = headEducationData.data;

            // Fetch Applicant Education Level
            const applicantEducationResponse = await fetch(`${EDUCATION_LEVEL_URL}/${applicantDao.applicantEducationLevelId}`);
            const applicantEducationData = await applicantEducationResponse.json();
            const applicantEducationDao: EducationLevelDAO = applicantEducationData.data;

            // Fetch Work Condition
            const workConditionResponse = await fetch(`${WORK_CONDITION_URL}/${applicantDao.workConditionId}`);
            const workConditionData = await workConditionResponse.json();
            const workConditionDao: WorkConditionDAO = workConditionData.data;

            // Fetch Activity Condition
            const activityConditionResponse = await fetch(`${ACTIVITY_CONDITION_URL}/${applicantDao.activityConditionId}`);
            const activityConditionData = await activityConditionResponse.json();
            const activityConditionDao: ActivityConditionDAO = activityConditionData.data;

            // Fetch Family Home
            const familyHomeResponse = await fetch(`${FAMILY_HOME_URL}/${applicantDao.identityCard}`);
            const familyHomeData = await familyHomeResponse.json();
            const familyHomeDao: FamilyHomeDAO = familyHomeData.data;

            // Fetch Housing
            const housingResponse = await fetch(`${HOUSING_URL}/${applicantDao.identityCard}`);
            const housingData = await housingResponse.json();
            const housingDao: HousingDAO = housingData.data;

            return daoToApplicantModel(
                applicantDao,
                stateDao,
                municipalityDao,
                parishDao,
                headEducationDao,
                applicantEducationDao,
                workConditionDao,
                activityConditionDao,
                familyHomeDao,
                housingDao
            );
        },

        createApplicant: async (data) => {
            const response = await fetch(APPLICANT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return result.data;
        },

        updateApplicant: async (id, data) => {
            const response = await fetch(`${APPLICANT_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return result.data;
        },

        deleteApplicant: async (id) => {
            await fetch(`${APPLICANT_URL}/${id}`, {
                method: 'DELETE'
            });
        }
    }
}
