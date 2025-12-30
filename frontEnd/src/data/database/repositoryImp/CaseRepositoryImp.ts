import { daoToCaseModel } from "#domain/models/case.ts";
import type { CaseRepository } from "../../../domain/repositories";
import { CASE_URL } from "./apiUrl";
import type { CaseInfoDAO } from "#database/daos/caseInfoDAO.ts";

export function getCaseRepository(): CaseRepository {
    return {
        findAllCases: async () => {
            const responseCase = await fetch(CASE_URL);
            const casesData = await responseCase.json();
            const caseDAOs: CaseInfoDAO[] = casesData.data;

            return caseDAOs.map(daoToCaseModel);
        },
        findCaseById: async (id) => {
            const responseCase = await fetch(`${CASE_URL}/${id}`);
            if (!responseCase.ok) return null;
            const casesData = await responseCase.json();
            const caseDAO: CaseInfoDAO = casesData.data;

            return daoToCaseModel(caseDAO);
        },
        createCase: async (data) => {
            const response = await fetch(CASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        },
        updateCase: async (id, data) => {
            const response = await fetch(`${CASE_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        },
        deleteCase: async (id) => {
            const response = await fetch(`${CASE_URL}/${id}`, {
                method: 'DELETE'
            });
        }
    }
}
