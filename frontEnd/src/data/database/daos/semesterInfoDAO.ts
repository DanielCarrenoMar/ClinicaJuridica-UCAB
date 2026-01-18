import type { SemesterDAO } from "./semesterDAO.ts";

export interface SemesterInfoDAO extends SemesterDAO {
    caseCount: number;
    studentCount: number;
    teacherCount: number;
}
