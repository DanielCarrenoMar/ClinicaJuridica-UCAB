import type { BeneficiaryDAO } from "./beneficiaryDAO";

export interface BeneficiaryInfoDAO extends BeneficiaryDAO {
  stateName?: string;
  municipalityName?: string;
  parishName?: string;
}
