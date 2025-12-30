import type { BeneficiaryDAO } from "./BeneficiaryDAO.ts";

export interface BeneficiaryInfoDAO extends BeneficiaryDAO {
  stateName?: string;
  municipalityName?: string;
  parishName?: string;
}
