import type { BeneficiaryDAO } from "./beneficiaryDAO.ts";

export interface BeneficiaryInfoDAO extends BeneficiaryDAO {
  identityCard: string;
  stateName?: string;
  municipalityName?: string;
  parishName?: string;
}
