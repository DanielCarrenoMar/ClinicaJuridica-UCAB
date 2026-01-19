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
            const response = await fetch(url);
            if (!response.ok) return [];
            const studentsData = await response.json();
            const studentDAOs: StudentDAO[] = studentsData.data;
            return studentDAOs.map(daoToStudentModel);
        },
        findStudentById: async (id) => {
            const responseStudent = await fetch(`${STUDENT_URL}/${id}`);
            if (!responseStudent.ok) return null;
            const studentData = await responseStudent.json();
            const studentDAO: StudentDAO = studentData.data;
            return daoToStudentModel(studentDAO);
        },

        getCasesByStudentId: async (id) => {
            const response = await fetch(`${STUDENT_URL}/${id}/cases`);
            if (!response.ok) return [];
            const result = await response.json();
            const daoList: CaseInfoDAO[] = result.data;
            return daoList.map(daoToCaseModel);
        },

        updateStudent: async (id: string, data: Partial<StudentModel>) => {
            const response = await fetch(`${STUDENT_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el estudiante');
            }
            const result = await response.json();
            const updatedStudentDAO: StudentDAO = result.data;
            return daoToStudentModel(updatedStudentDAO);
        },

        importStudents: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${STUDENT_URL}/import`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al importar estudiantes');
            }

            return await response.json();
        },

        createStudent: async (data: Omit<StudentDAO, 'term'>) => {
            const response = await fetch(STUDENT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear estudiante');
            }
            return await response.json();
        }

    } as StudentRepository;
}