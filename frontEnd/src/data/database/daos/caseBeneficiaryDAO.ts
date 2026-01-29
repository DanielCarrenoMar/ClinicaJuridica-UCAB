import type { CaseBeneficiaryTypeDTO, IdNationalityTypeDTO } from "../typesDAO.ts";

export interface CaseBeneficiaryDAO {
  identityCard: string;
  idCase: number;
  fullName: string;
  idNationality?: IdNationalityTypeDTO;
  relationship: string;
  caseType: CaseBeneficiaryTypeDTO;
  description: string;
}
