import type{ CaseBeneficiaryTypeDAO } from "#database/typesDAO.ts";

export interface BeneficiaryTypeDistribution {
  type: CaseBeneficiaryTypeDAO; 
  count: number;
}
