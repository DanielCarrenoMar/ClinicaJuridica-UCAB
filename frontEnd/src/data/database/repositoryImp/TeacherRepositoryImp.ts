import type { TeacherRepository } from "#domain/repositories.ts";
import { TEACHER_URL } from "./apiUrl";
import type { TeacherDAO } from "#database/daos/teacherDAO.ts";
import { daoToTeacherModel } from "#domain/models/teacher.ts";

import type { CaseInfoDAO } from "#database/daos/caseInfoDAO.ts";
import { daoToCaseModel } from "#domain/models/case.ts";
export function getTeacherRepository(): TeacherRepository {
    return {
        findAllTeachers: async (params) => {
            const query = new URLSearchParams();
            if (params?.page !== undefined) query.set('page', String(params.page));
            if (params?.limit !== undefined) query.set('limit', String(params.limit));
            const url = query.toString() ? `${TEACHER_URL}?${query.toString()}` : TEACHER_URL;
            const response = await fetch(url, { method: 'GET', credentials: 'include' });
            const teachersData = await response.json();
            if (!response.ok) throw new Error(teachersData.message || 'Error fetching teachers');
            const teacherDAOs: TeacherDAO[] = teachersData.data;
            return teacherDAOs.map(daoToTeacherModel);
        },
        findTeacherById: async (id) => {
            const responseTeacher = await fetch(`${TEACHER_URL}/${id}`, { method: 'GET', credentials: 'include' });
            const teacherData = await responseTeacher.json();
            if (!responseTeacher.ok) throw new Error(teacherData.message || 'Error fetching teacher');
            const teacherDAO: TeacherDAO = teacherData.data;
            return daoToTeacherModel(teacherDAO);
        },

        getCasesByTeacherId: async (id, params) => {
            const query = new URLSearchParams();
            if (params?.page !== undefined) query.set('page', String(params.page));
            if (params?.limit !== undefined) query.set('limit', String(params.limit));
            const url = query.toString()
                ? `${TEACHER_URL}/${id}/cases?${query.toString()}`
                : `${TEACHER_URL}/${id}/cases`;
            const response = await fetch(url, { method: 'GET', credentials: 'include' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error fetching cases for teacher');
            const daoList: CaseInfoDAO[] = result.data;
            return daoList.map(daoToCaseModel);
        },

        updateTeacher: async (id, data) => {
            const response = await fetch(`${TEACHER_URL}/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result?.message || 'Error al actualizar el profesor');
            const updatedTeacherDAO: TeacherDAO = result.data;
            return daoToTeacherModel(updatedTeacherDAO);
        },

        createTeacher: async (data: Omit<TeacherDAO, 'term'>) => {
            const response = await fetch(TEACHER_URL, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result?.message || 'Error al crear profesor');
            return result;
        }

    } as TeacherRepository;
}