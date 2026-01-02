import type { StudentRepository } from "#domain/repositories.ts";
import { STUDENT_URL } from "./apiUrl";
import type { StudentDAO } from "#database/daos/studentDAO.ts";
import { daoToStudentModel } from "#domain/models/student.ts";
export function getStudentRepository(): StudentRepository {
    return {
        findStudentById: async (id) => {
            const responseStudent = await fetch(`${STUDENT_URL}/${id}`);
            if (!responseStudent.ok) return null;
            const studentData = await responseStudent.json();
            const studentDAO: StudentDAO = studentData.data;
            return daoToStudentModel(studentDAO);
        },

    } as StudentRepository;
}