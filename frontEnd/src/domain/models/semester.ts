import type { SemesterDAO } from "#database/daos/semesterDAO.ts";

export interface SemesterModel {
    term: string;
    startDate: Date;
    endDate: Date;
    caseCount: number;
}

export function daoToSemesterModel(dao: SemesterDAO): SemesterModel {
    return {
        ...dao,
        startDate: new Date(dao.startDate),
        endDate: new Date(dao.endDate),
        caseCount: dao.caseCount ?? 0,
    };
}
