import type { ApplicantRepository } from "../../../domain/repositories";
import type { ApplicantDAO } from "../daos/applicantDAO";
import { daoToApplicantModel, type ApplicantModel } from "#domain/models/applicant.ts";
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

async function fetchDaosToApplicantModel(applicantDao: ApplicantDAO): Promise<ApplicantModel> {
    let stateDao: StateDAO | undefined;
    let municipalityDao: MunicipalityDAO | undefined;
    let parishDao: ParishDAO | undefined;
    let headEducationDao: EducationLevelDAO | undefined;
    let applicantEducationDao: EducationLevelDAO | undefined;
    let workConditionDao: WorkConditionDAO | undefined;
    let activityConditionDao: ActivityConditionDAO | undefined;

    if (applicantDao.idState){
        const stateResponse = await fetch(`${STATE_URL}/${applicantDao.idState}`);
        const stateData = await stateResponse.json();
        stateDao = stateData.data;
    }

    if (applicantDao.municipalityNumber){
        const municipalityResponse = await fetch(`${MUNICIPALITY_URL}/${applicantDao.municipalityNumber}`);
        const municipalityData = await municipalityResponse.json();
        municipalityDao = municipalityData.data;
    }

    if (applicantDao.parishNumber){
        const parishResponse = await fetch(`${PARISH_URL}/${applicantDao.parishNumber}`);
        const parishData = await parishResponse.json();
        parishDao = parishData.data;
    }

    if (applicantDao.headEducationLevelId){
        const headEducationResponse = await fetch(`${EDUCATION_LEVEL_URL}/${applicantDao.headEducationLevelId}`);
        const headEducationData = await headEducationResponse.json();
        headEducationDao = headEducationData.data;
    }

    if (applicantDao.applicantEducationLevelId){
        const applicantEducationResponse = await fetch(`${EDUCATION_LEVEL_URL}/${applicantDao.applicantEducationLevelId}`);
        const applicantEducationData = await applicantEducationResponse.json();
        applicantEducationDao = applicantEducationData.data;
    }

    if (applicantDao.workConditionId){
        const workConditionResponse = await fetch(`${WORK_CONDITION_URL}/${applicantDao.workConditionId}`);
        const workConditionData = await workConditionResponse.json();
        workConditionDao = workConditionData.data;
    }

    if (applicantDao.activityConditionId){
        const activityConditionResponse = await fetch(`${ACTIVITY_CONDITION_URL}/${applicantDao.activityConditionId}`);
        const activityConditionData = await activityConditionResponse.json();
        activityConditionDao = activityConditionData.data;
    }

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
        familyHomeDao,
        housingDao,
        headEducationDao,
        applicantEducationDao,
        workConditionDao,
        activityConditionDao,
        stateDao,
        municipalityDao,
        parishDao,
    );
}

export function getApplicantRepository(): ApplicantRepository {
    return {
        findAllApplicants: async () => {
            const responseApplicant = await fetch(APPLICANT_URL);
            const applicantsData = await responseApplicant.json();
            const applicantDAOs: ApplicantDAO[] = applicantsData.data;

            const applicantsWithAllData = await Promise.all(
                applicantDAOs.map(async (applicantDao) => {
                    return await fetchDaosToApplicantModel(applicantDao);
                })
            );

            return applicantsWithAllData;
        },

        findApplicantById: async (id) => {
            const response = await fetch(`${APPLICANT_URL}/${id}`);
            if (!response.ok) return null;
            const applicantData = await response.json();
            const applicantDao: ApplicantDAO = applicantData.data;

            return await fetchDaosToApplicantModel(applicantDao);
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
