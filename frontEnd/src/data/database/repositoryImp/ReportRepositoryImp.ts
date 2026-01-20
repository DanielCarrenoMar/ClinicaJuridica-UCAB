import type { ReportRepository } from "#domain/repositories.ts";
import { REPORT_URL } from "./apiUrl";

import { casesBySubjectDAOToModel } from "#domain/models/reports/casesBySubject.ts";
import { casesBySubjectScopeDAOToModel } from "#domain/models/reports/casesBySubjectScope.ts";
import { genderDistributionDAOToModel } from "#domain/models/reports/genderDistribution.ts";
import { stateDistributionDAOToModel } from "#domain/models/reports/stateDistribution.ts";
import { parishDistributionDAOToModel } from "#domain/models/reports/parishDistribution.ts";
import { casesByTypeDAOToModel } from "#domain/models/reports/casesByType.ts";
import { beneficiariesByParishDAOToModel } from "#domain/models/reports/beneficiariesByParish.ts";
import { studentInvolvementDAOToModel } from "#domain/models/reports/studentInvolvement.ts";
import { casesByServiceTypeDAOToModel } from "#domain/models/reports/casesByServiceType.ts";
import { professorInvolvementDAOToModel } from "#domain/models/reports/professorInvolvement.ts";
import { beneficiaryTypeDistributionDAOToModel } from "#domain/models/reports/beneficiaryTypeDistribution.ts";

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
            return (result.data || []).map(casesBySubjectDAOToModel);
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
            return (result.data || []).map(casesBySubjectScopeDAOToModel);
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
            return (result.data || []).map(genderDistributionDAOToModel);
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
            return (result.data || []).map(stateDistributionDAOToModel);
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
            return (result.data || []).map(parishDistributionDAOToModel);
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
            return (result.data || []).map(casesByTypeDAOToModel);
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
            return (result.data || []).map(beneficiariesByParishDAOToModel);
        },

        getStudentInvolvement: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${REPORT_URL}/students/involvement?${query.toString()}` : `${REPORT_URL}/students/involvement`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching student involvement');
            }
            const result = await response.json();
            return (result.data || []).map(studentInvolvementDAOToModel);
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
            return (result.data || []).map(casesByServiceTypeDAOToModel);
        },

        getProfessorInvolvement: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${REPORT_URL}/professors/involvement?${query.toString()}` : `${REPORT_URL}/professors/involvement`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching professor involvement');
            }
            const result = await response.json();
            return (result.data || []).map(professorInvolvementDAOToModel);
        },

        getBeneficiaryTypeDistribution: async (startDate?, endDate?) => {
            const query = new URLSearchParams();
            if (startDate) query.set('startDate', startDate.toISOString());
            if (endDate) query.set('endDate', endDate.toISOString());
            const url = query.toString() ? `${REPORT_URL}/beneficiaries/type-distribution?${query.toString()}` : `${REPORT_URL}/beneficiaries/type-distribution`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching beneficiary type distribution');
            }
            const result = await response.json();
            return (result.data || []).map(beneficiaryTypeDistributionDAOToModel);
        }
    };
}
