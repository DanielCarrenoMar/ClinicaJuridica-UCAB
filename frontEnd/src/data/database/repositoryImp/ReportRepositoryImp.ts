import type { ReportRepository } from "#domain/repositories.ts";
import { REPORT_URL } from "./apiUrl";

export function getReportRepository(): ReportRepository {
    return {
        getCasesBySubject: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${REPORT_URL}/cases/by-subject?${query.toString()}` : `${REPORT_URL}/cases/by-subject`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching cases by subject');
            }
            const result = await response.json();
            return result.data || [];
        },

        getCasesBySubjectScope: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${REPORT_URL}/cases/by-subject-scope?${query.toString()}` : `${REPORT_URL}/cases/by-subject-scope`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching cases by subject scope');
            }
            const result = await response.json();
            return result.data || [];
        },

        getGenderDistribution: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${REPORT_URL}/gender-distribution?${query.toString()}` : `${REPORT_URL}/gender-distribution`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching gender distribution');
            }
            const result = await response.json();
            return result.data || [];
        },

        getStateDistribution: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${REPORT_URL}/state-distribution?${query.toString()}` : `${REPORT_URL}/state-distribution`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching state distribution');
            }
            const result = await response.json();
            return result.data || [];
        },

        getParishDistribution: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${REPORT_URL}/parish-distribution?${query.toString()}` : `${REPORT_URL}/parish-distribution`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching parish distribution');
            }
            const result = await response.json();
            return result.data || [];
        },

        getCasesByType: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${REPORT_URL}/cases/by-type?${query.toString()}` : `${REPORT_URL}/cases/by-type`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching cases by type');
            }
            const result = await response.json();
            return result.data || [];
        },

        getBeneficiariesByParish: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${REPORT_URL}/beneficiaries/by-parish?${query.toString()}` : `${REPORT_URL}/beneficiaries/by-parish`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching beneficiaries by parish');
            }
            const result = await response.json();
            return result.data || [];
        },

        getStudentInvolvement: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${REPORT_URL}/student-involvement?${query.toString()}` : `${REPORT_URL}/student-involvement`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching student involvement');
            }
            const result = await response.json();
            return result.data || [];
        },

        getCasesByServiceType: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${REPORT_URL}/cases/by-service-type?${query.toString()}` : `${REPORT_URL}/cases/by-service-type`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching cases by service type');
            }
            const result = await response.json();
            return result.data || [];
        },

        getProfessorInvolvement: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${REPORT_URL}/professor-involvement?${query.toString()}` : `${REPORT_URL}/professor-involvement`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching professor involvement');
            }
            const result = await response.json();
            return result.data || [];
        },

        getBeneficiaryTypeDistribution: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${REPORT_URL}/beneficiary-type-distribution?${query.toString()}` : `${REPORT_URL}/beneficiary-type-distribution`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching beneficiary type distribution');
            }
            const result = await response.json();
            return result.data || [];
        }
    };
}
