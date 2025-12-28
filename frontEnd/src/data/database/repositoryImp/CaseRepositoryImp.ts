import { daoToCaseModel } from "#domain/models/case.ts";
import type { CaseRepository } from "../../../domain/repositories";
import type { CaseDAO } from "../daos/CaseDAO";

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
