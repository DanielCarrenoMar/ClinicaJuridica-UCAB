import type { TeacherRepository } from "#domain/repositories.ts";
import { TEACHER_URL } from "./apiUrl";
import type { TeacherDAO } from "#database/daos/teacherDAO.ts";
import { daoToTeacherModel } from "#domain/models/teacher.ts";
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

    } as TeacherRepository;
}