import type { StudentRepository } from "#domain/repositories.ts";
import { STUDENT_URL } from "./apiUrl";
import type { StudentDAO } from "#database/daos/studentDAO.ts";
import { daoToStudentModel } from "#domain/models/student.ts";
import type { CaseInfoDAO } from "#database/daos/caseInfoDAO.ts";
import { daoToCaseModel } from "#domain/models/case.ts";
export function getStudentRepository(): StudentRepository {
    return {
        findAllStudents: async () => {
            const response = await fetch(STUDENT_URL);
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

    } as StudentRepository;
}