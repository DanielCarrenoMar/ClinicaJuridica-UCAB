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
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error fetching cases by subject');
            }
            return result.data || [];
        },

        getCasesBySubjectScope: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${STATS_URL}/cases/by-subject-scope?${query.toString()}` : `${STATS_URL}/cases/by-subject-scope`;
            const response = await fetch(url);
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error fetching cases by subject scope');
            }
            return result.data || [];
        },

        getGenderDistribution: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${STATS_URL}/gender-distribution?${query.toString()}` : `${STATS_URL}/gender-distribution`;
            const response = await fetch(url);
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error fetching gender distribution');
            }
            return result.data || [];
        },

        getStateDistribution: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${STATS_URL}/state-distribution?${query.toString()}` : `${STATS_URL}/state-distribution`;
            const response = await fetch(url);
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error fetching state distribution');
            }
            return result.data || [];
        },

        getParishDistribution: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${STATS_URL}/parish-distribution?${query.toString()}` : `${STATS_URL}/parish-distribution`;
            const response = await fetch(url);
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error fetching parish distribution');
            }
            return result.data || [];
        },

        getCasesByType: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${STATS_URL}/cases/by-type?${query.toString()}` : `${STATS_URL}/cases/by-type`;
            const response = await fetch(url);
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error fetching cases by type');
            }
            return result.data || [];
        },

        getBeneficiariesByParish: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${STATS_URL}/beneficiaries/by-parish?${query.toString()}` : `${STATS_URL}/beneficiaries/by-parish`;
            const response = await fetch(url);
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error fetching beneficiaries by parish');
            }
            return result.data || [];
        },

        getStudentInvolvement: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${STATS_URL}/students/involvement?${query.toString()}` : `${STATS_URL}/students/involvement`;
            const response = await fetch(url);
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error fetching student involvement');
            }
            return result.data || [];
        },

        getCasesByServiceType: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${STATS_URL}/cases/by-service-type?${query.toString()}` : `${STATS_URL}/cases/by-service-type`;
            const response = await fetch(url);
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error fetching cases by service type');
            }
            return result.data || [];
        },

        getProfessorInvolvement: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${STATS_URL}/professors/involvement?${query.toString()}` : `${STATS_URL}/professors/involvement`;
            const response = await fetch(url);
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error fetching professor involvement');
            }
            return result.data || [];
        },

        getBeneficiaryTypeDistribution: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${STATS_URL}/beneficiaries/type-distribution?${query.toString()}` : `${STATS_URL}/beneficiaries/type-distribution`;
            const response = await fetch(url);
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error fetching beneficiary type distribution');
            }
            return result.data || [];
        },
    };
}
