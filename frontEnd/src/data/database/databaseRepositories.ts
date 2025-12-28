import { daoToCaseModel } from "#domain/models/case.ts";
import type { ApplicantRepository, BeneficiaryRepository, CaseRepository } from "../../domain/repositories";
import type { CaseDAO } from "./daos/CaseDAO";

export function getBeneficiaryRepository(): BeneficiaryRepository {
    const API_URL = "http://localhost:3000/api/v1/applicants";

    return {
        findAllBeneficiaries: async () => {
            const response = await fetch(API_URL);
            return await response.json();
        },
        findBeneficiaryById: async (id) => {
            const response = await fetch(`${API_URL}/${id}`);
            return await response.json();
        },
        createBeneficiary: async (data) => {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        },
        updateBeneficiary: async (id, data) => {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        },
        deleteBeneficiary: async (id) => {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
        }
    }
}

export function useApplicantRepository(): ApplicantRepository {
    return {
        findAll: async () => {
            /* ... */ return null as any;
        },
        create: async (data) => {
            /* ... */ return null as any;
        },
        // ... implementar findById, update, delete
        findById: async (id) => { /* ... */ return null as any; },
        update: async (id, data) => { /* ... */ return null as any; },
        delete: async (id) => { /* ... */ },
    }
}

export function getCaseRepository(): CaseRepository {
    const API_URL = "http://localhost:3000/api/v1/cases";

    return {
        findAllCases: async () => {
            const response = await fetch(API_URL);
            const caseDAO: CaseDAO[] = (await response.json()).data;
            return caseDAO.map(daoToCaseModel);
        },
        findCaseById: async (id) => {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) return null;
            return await response.json();
        },
        createCase: async (data) => {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        },
        updateCase: async (id, data) => {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        },
        deleteCase: async (id) => {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
        }
    }
}