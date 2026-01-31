import type { ApplicantInfoDAO } from "#database/daos/applicantInfoDAO.ts";
import type { ApplicantModel } from "#domain/models/applicant.ts";
import { daoToApplicantModel, modelToApplicantDao } from "#domain/models/applicant.ts";
import type { ApplicantRepository } from "../../../domain/repositories";
import {
    APPLICANT_URL,
} from "./apiUrl";

export function getApplicantRepository(): ApplicantRepository {
    return {
        findApplicantById: async (id) => {
            const response = await fetch(`${APPLICANT_URL}/${id}`, {
                method: 'GET',
                credentials: 'include'
            });
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.message || 'Error en la obtención del applicant');

            const applicantDao: ApplicantInfoDAO = responseData.data;
            return daoToApplicantModel(applicantDao);
        },

        createApplicant: async (data) => {
            const applicantDAO = modelToApplicantDao(data)
            const response = await fetch(APPLICANT_URL, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...applicantDAO,
                })
            });
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.message || 'Error en la creación del applicant');
            return daoToApplicantModel(responseData.data as ApplicantInfoDAO);
        },

        updateApplicant: async (id, data) => {
            const applicantDAO = modelToApplicantDao(data as ApplicantModel);
            const response = await fetch(`${APPLICANT_URL}/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...applicantDAO,
                })
            });
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.message || 'Error en la actualización del applicant');
            return daoToApplicantModel(responseData.data as ApplicantInfoDAO);
        },

        deleteApplicant: async (id) => {
            const response = await fetch(`${APPLICANT_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData?.message || 'Error en la eliminación del applicant');
        }
    }
}
