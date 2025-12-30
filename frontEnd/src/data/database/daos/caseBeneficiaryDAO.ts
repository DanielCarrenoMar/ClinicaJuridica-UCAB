import type { BeneficiaryDAO } from "./BeneficiaryDAO.ts";
import type { CaseBeneficiaryTypeDAO } from "./typesDAO.ts";

export interface CaseBeneficiaryDAO extends Omit<BeneficiaryDAO, 'type'> {
  idCase: number;
  relationship: string;
  type: CaseBeneficiaryTypeDAO;
  description: string;
}
