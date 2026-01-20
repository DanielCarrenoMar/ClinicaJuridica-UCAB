import { STATS_URL } from "./apiUrl";

export interface StatsRepository {
    getCasesBySubject(startDate?: Date, endDate?: Date): Promise<any[]>;
    getCasesBySubjectScope(startDate?: Date, endDate?: Date): Promise<any[]>;
    getGenderDistribution(startDate?: Date, endDate?: Date): Promise<any[]>;
    getStateDistribution(startDate?: Date, endDate?: Date): Promise<any[]>;
    getParishDistribution(startDate?: Date, endDate?: Date): Promise<any[]>;
    getCasesByType(startDate?: Date, endDate?: Date): Promise<any[]>;
    getBeneficiariesByParish(startDate?: Date, endDate?: Date): Promise<any[]>;
    getStudentInvolvement(startDate?: Date, endDate?: Date): Promise<any[]>;
    getCasesByServiceType(startDate?: Date, endDate?: Date): Promise<any[]>;
    getProfessorInvolvement(startDate?: Date, endDate?: Date): Promise<any[]>;
    getBeneficiaryTypeDistribution(startDate?: Date, endDate?: Date): Promise<any[]>;
}

export function getStatsRepository(): StatsRepository {
    return {
        getCasesBySubject: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${STATS_URL}/cases/by-subject?${query.toString()}` : `${STATS_URL}/cases/by-subject`;
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
            const url = query.toString() ? `${STATS_URL}/cases/by-subject-scope?${query.toString()}` : `${STATS_URL}/cases/by-subject-scope`;
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
            const url = query.toString() ? `${STATS_URL}/gender-distribution?${query.toString()}` : `${STATS_URL}/gender-distribution`;
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
            const url = query.toString() ? `${STATS_URL}/state-distribution?${query.toString()}` : `${STATS_URL}/state-distribution`;
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
            const url = query.toString() ? `${STATS_URL}/parish-distribution?${query.toString()}` : `${STATS_URL}/parish-distribution`;
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
            const url = query.toString() ? `${STATS_URL}/cases/by-type?${query.toString()}` : `${STATS_URL}/cases/by-type`;
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
            const url = query.toString() ? `${STATS_URL}/beneficiaries/by-parish?${query.toString()}` : `${STATS_URL}/beneficiaries/by-parish`;
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
            const url = query.toString() ? `${STATS_URL}/student-involvement?${query.toString()}` : `${STATS_URL}/student-involvement`;
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
            const url = query.toString() ? `${STATS_URL}/cases/by-service-type?${query.toString()}` : `${STATS_URL}/cases/by-service-type`;
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
            const url = query.toString() ? `${STATS_URL}/professor-involvement?${query.toString()}` : `${STATS_URL}/professor-involvement`;
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
            const url = query.toString() ? `${STATS_URL}/beneficiary-type-distribution?${query.toString()}` : `${STATS_URL}/beneficiary-type-distribution`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching beneficiary type distribution');
            }
            const result = await response.json();
            return result.data || [];
        }
    };
}
