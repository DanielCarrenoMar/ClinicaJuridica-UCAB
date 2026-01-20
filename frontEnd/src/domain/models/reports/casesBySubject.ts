import type { CasesBySubject } from "#database/daos/reports/casesBySubjectDAO.ts";

export interface CasesBySubjectModel {
  subject: string;
  count: number;
}

export function casesBySubjectDAOToModel(dao: CasesBySubject): CasesBySubjectModel {
  return {
    subject: dao.subject,
    count: dao.count,
  };
}
