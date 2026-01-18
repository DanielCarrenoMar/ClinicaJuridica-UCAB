import type { SemesterInfoDAO } from "#database/daos/semesterInfoDAO.ts";

export interface SemesterModel {
    term: string;
    startDate: Date;
    endDate: Date;
    caseCount: number;
    studentCount: number;
    teacherCount: number;
}

export function daoToSemesterModel(dao: SemesterInfoDAO): SemesterModel {
    return {
        term: dao.term,
        startDate: new Date(dao.startDate),
        endDate: new Date(dao.endDate),
        caseCount: dao.caseCount ?? 0,
        studentCount: dao.studentCount ?? 0,
        teacherCount: dao.teacherCount ?? 0,
    };
}
