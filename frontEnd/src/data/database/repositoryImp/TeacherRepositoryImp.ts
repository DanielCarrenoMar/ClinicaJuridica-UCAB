import type { TeacherRepository } from "#domain/repositories.ts";
import { TEACHER_URL } from "./apiUrl";
import type { TeacherDAO } from "#database/daos/teacherDAO.ts";
import { daoToTeacherModel, type TeacherModel } from "#domain/models/teacher.ts";

import type { CaseInfoDAO } from "#database/daos/caseInfoDAO.ts";
import { daoToCaseModel } from "#domain/models/case.ts";
export function getTeacherRepository(): TeacherRepository {
    return {
        findAllTeachers: async () => {
            const response = await fetch(TEACHER_URL);
            if (!response.ok) return [];
            const teachersData = await response.json();
            const teacherDAOs: TeacherDAO[] = teachersData.data;
            return teacherDAOs.map(daoToTeacherModel);
        },
        findTeacherById: async (id) => {
            const responseTeacher = await fetch(`${TEACHER_URL}/${id}`);
            if (!responseTeacher.ok) return null;
            const teacherData = await responseTeacher.json();
            const teacherDAO: TeacherDAO = teacherData.data;
            return daoToTeacherModel(teacherDAO);
        },

        getCasesByTeacherId: async (id) => {
            const response = await fetch(`${TEACHER_URL}/${id}/cases`);
            if (!response.ok) return [];
            const result = await response.json();
            const daoList: CaseInfoDAO[] = result.data;
            return daoList.map(daoToCaseModel);
        },

        updateTeacher: async (id, data) => {
            const response = await fetch(`${TEACHER_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el profesor');
            }
            const result = await response.json();
            const updatedTeacherDAO: TeacherDAO = result.data;
            return daoToTeacherModel(updatedTeacherDAO);
        }

    } as TeacherRepository;
}