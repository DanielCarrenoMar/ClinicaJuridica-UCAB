import type { CaseBeneficiaryTypeDAO, IdNationalityTypeDAO } from "../typesDAO.ts";

export interface CaseBeneficiaryDAO {
  identityCard: string;
  idCase: number;
  fullName: string;
  idNationality?: IdNationalityTypeDAO;
  relationship: string;
  caseType: CaseBeneficiaryTypeDAO;
  description: string;
}
