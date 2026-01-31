import type { StudentRepository } from "#domain/repositories.ts";
import { STUDENT_URL } from "./apiUrl";
import type { StudentDAO } from "#database/daos/studentDAO.ts";
import { daoToStudentModel, type StudentModel } from "#domain/models/student.ts";
import type { CaseInfoDAO } from "#database/daos/caseInfoDAO.ts";
import { daoToCaseModel } from "#domain/models/case.ts";
export function getStudentRepository(): StudentRepository {
    return {
        findAllStudents: async (params) => {
            const query = new URLSearchParams();
            if (params?.page !== undefined) query.set('page', String(params.page));
            if (params?.limit !== undefined) query.set('limit', String(params.limit));
            const url = query.toString() ? `${STUDENT_URL}?${query.toString()}` : STUDENT_URL;
            const response = await fetch(url, { method: 'GET', credentials: 'include' });
            const studentsData = await response.json();
            if (!response.ok) throw new Error(studentsData.message || 'Error fetching students');
            const studentDAOs: StudentDAO[] = studentsData.data;
            return studentDAOs.map(daoToStudentModel);
        },
        findStudentById: async (id) => {
            const responseStudent = await fetch(`${STUDENT_URL}/${id}`, { method: 'GET', credentials: 'include' });
            const studentData = await responseStudent.json();
            if (!responseStudent.ok) throw new Error(studentData.message || 'Error fetching student');
            const studentDAO: StudentDAO = studentData.data;
            return daoToStudentModel(studentDAO);
        },

        getCasesByStudentId: async (id, params) => {
            const query = new URLSearchParams();
            if (params?.page !== undefined) query.set('page', String(params.page));
            if (params?.limit !== undefined) query.set('limit', String(params.limit));
            const url = query.toString()
                ? `${STUDENT_URL}/${id}/cases?${query.toString()}`
                : `${STUDENT_URL}/${id}/cases`;
            const response = await fetch(url, { method: 'GET', credentials: 'include' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error fetching cases for student');
            const daoList: CaseInfoDAO[] = result.data;
            return daoList.map(daoToCaseModel);
        },

        updateStudent: async (id: string, data: Partial<StudentModel>) => {
            const response = await fetch(`${STUDENT_URL}/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result?.message || 'Error al actualizar el estudiante');
            const updatedStudentDAO: StudentDAO = result.data;
            return daoToStudentModel(updatedStudentDAO);
        },

        importStudents: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${STUDENT_URL}/import`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result?.message || 'Error al importar estudiantes');
            return result;
        },

        createStudent: async (data: Omit<StudentDAO, 'term'>) => {
            const response = await fetch(STUDENT_URL, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result?.message || 'Error al crear estudiante');
            return result;
        }

    } as StudentRepository;
}