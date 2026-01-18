import { daoToSemesterModel, type SemesterModel } from "#domain/models/semester.ts";
import type { SemesterRepository } from "../../../domain/repositories";
import { SEMESTER_URL } from "./apiUrl";
import type { SemesterDAO } from "#database/daos/semesterDAO.ts";

export function getSemesterRepository(): SemesterRepository {
    return {
        findAllSemesters: async () => {
            const response = await fetch(SEMESTER_URL);
            if (!response.ok) return [];
            const result = await response.json();
            const semesters: SemesterDAO[] = result.data || [];
            return semesters.map(daoToSemesterModel);
        },
        findCurrentSemester: async () => {
            const response = await fetch(`${SEMESTER_URL}/current`);
            if (!response.ok) return null;
            const result = await response.json();
            const semester: SemesterDAO = result.data;
            return semester ? daoToSemesterModel(semester) : null;
        },
        findSemesterById: async (term: string) => {
            const response = await fetch(`${SEMESTER_URL}/${term}`);
            if (!response.ok) return null;
            const result = await response.json();
            const semester: SemesterDAO = result.data;
            return semester ? daoToSemesterModel(semester) : null;
        },
        createSemester: async (data) => {
            const response = await fetch(SEMESTER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    term: data.term,
                    startDate: data.startDate.toISOString().split('T')[0],
                    endDate: data.endDate.toISOString().split('T')[0]
                })
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || result.message || 'Error creating semester');
            }
            const semester: SemesterDAO = result.data;
            return daoToSemesterModel(semester);
        },
        updateSemester: async (term, data) => {
            const body: any = {};
            if (data.startDate) body.startDate = data.startDate.toISOString().split('T')[0];
            if (data.endDate) body.endDate = data.endDate.toISOString().split('T')[0];

            const response = await fetch(`${SEMESTER_URL}/${term}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || result.message || 'Error updating semester');
            }
            const semester: SemesterDAO = result.data;
            return daoToSemesterModel(semester);
        },
        deleteSemester: async (term) => {
            const response = await fetch(`${SEMESTER_URL}/${term}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const result = await response.json().catch(() => null);
                throw new Error(result?.error || result?.message || 'Error deleting semester');
            }
        }
    };
}
