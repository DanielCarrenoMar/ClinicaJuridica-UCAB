import type { CasesBySubjectScope } from "#database/daos/reports/casesBySubjectScopeDAO.ts";

export interface CasesBySubjectScopeModel {
  subject: string;
  scope: string;
  subScope: string;
  count: number;
}

export function casesBySubjectScopeDAOToModel(dao: CasesBySubjectScope): CasesBySubjectScopeModel {
  return {
    subject: dao.subject,
    scope: dao.scope,
    subScope: dao.subScope,
    count: dao.count,
  };
}
