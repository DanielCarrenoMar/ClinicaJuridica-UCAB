import type{ GenderTypeDAO } from "#database/typesDAO.ts";

export interface GenderDistribution {
  type: 'Applicants' | 'Beneficiaries';
  gender: GenderTypeDAO;
  count: number;
}
