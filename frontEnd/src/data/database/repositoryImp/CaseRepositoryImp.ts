import type { UserDAO } from "#database/daos/UserDAO.ts";
import { daoToCaseModel } from "#domain/models/case.ts";
import type { CaseRepository } from "../../../domain/repositories";
import type { CaseDAO } from "../daos/CaseDAO";
import { CASE_URL, USER_URL } from "./apiUrl";

export function getCaseRepository(): CaseRepository {
    return {
        findAllCases: async () => {
            const responseCase = await fetch(CASE_URL);
            const casesData = await responseCase.json();
            const caseDAOs: CaseDAO[] = casesData.data;

            const casesWithTeachers = await Promise.all(
                caseDAOs.map(async (caseDao) => {
                    const responseUser = await fetch(`${USER_URL}/${caseDao.teacherId}`); 
                    const userData = await responseUser.json();
                    const userDaoTeacher:UserDAO = userData.data;
                    return daoToCaseModel(caseDao, userDaoTeacher);
                })
            );

            return casesWithTeachers;
        },
        findCaseById: async (id) => {
            const response = await fetch(`${CASE_URL}/${id}`);
            if (!response.ok) return null;
            return await response.json();
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
