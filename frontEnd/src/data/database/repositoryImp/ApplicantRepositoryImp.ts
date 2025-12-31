import type { ApplicantInfoDAO } from "#database/daos/applicantInfoDAO.ts";
import { daoToApplicantModel } from "#domain/models/applicant.ts";
import type { ApplicantRepository } from "../../../domain/repositories";
import {
    APPLICANT_URL,
} from "./apiUrl";

export function getApplicantRepository(): ApplicantRepository {
    return {
        findApplicantById: async (id) => {
            const response = await fetch(`${APPLICANT_URL}/${id}`);
            if (!response.ok) return null;
            const applicantData = await response.json();
            const applicantDao: ApplicantInfoDAO = applicantData.data;

            return daoToApplicantModel(applicantDao);
        },

        createApplicant: async (data) => {
            const response = await fetch(APPLICANT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    idNacionality: (data as any).idNationality ?? (data as any).idNacionality,
                })
            });
            const result = await response.json();
            return daoToApplicantModel(result.data as ApplicantInfoDAO);
        },

        updateApplicant: async (id, data) => {
            const response = await fetch(`${APPLICANT_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    idNacionality: (data as any).idNationality ?? (data as any).idNacionality,
                })
            });
            const result = await response.json();
            return daoToApplicantModel(result.data as ApplicantInfoDAO);
        },

        deleteApplicant: async (id) => {
            await fetch(`${APPLICANT_URL}/${id}`, {
                method: 'DELETE'
            });
        }
    }
}
