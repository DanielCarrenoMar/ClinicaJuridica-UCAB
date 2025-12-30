import type { CaseBeneficiaryTypeDAO } from "./typesDAO.ts";

export interface CaseBeneficiaryDAO {
  idCase: number;
  beneficiaryId: string;
  relationship: string;
  type: CaseBeneficiaryTypeDAO;
  description: string;
}
