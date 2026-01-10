import type { BeneficiaryDAO } from "./beneficiaryDAO.ts";
import type { CaseBeneficiaryTypeDAO } from "../typesDAO.ts";

export interface CaseBeneficiaryDAO extends BeneficiaryDAO {
  idCase: number;
  relationship: string;
  caseType: CaseBeneficiaryTypeDAO;
  description: string;
}
