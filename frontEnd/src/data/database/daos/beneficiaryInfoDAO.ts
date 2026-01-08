import type { BeneficiaryDAO } from "./beneficiaryDAO.ts";

export interface BeneficiaryInfoDAO extends BeneficiaryDAO {
  stateName?: string;
  municipalityName?: string;
  parishName?: string;
}
