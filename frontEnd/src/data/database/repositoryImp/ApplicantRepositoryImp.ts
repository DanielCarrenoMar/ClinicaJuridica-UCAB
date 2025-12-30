import { daoToApplicantModel } from "#domain/models/applicant.ts";
import type { ApplicantRepository } from "../../../domain/repositories";
import type { ApplicantDAO } from "../daos/applicantDAO";
import {
    APPLICANT_URL,
} from "./apiUrl";

export function getApplicantRepository(): ApplicantRepository {
    return {
        findApplicantById: async (id) => {
            const response = await fetch(`${APPLICANT_URL}/${id}`);
            if (!response.ok) return null;
            const applicantData = await response.json();
            const applicantDao: ApplicantDAO = applicantData.data;

            return daoToApplicantModel(applicantDao);
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
