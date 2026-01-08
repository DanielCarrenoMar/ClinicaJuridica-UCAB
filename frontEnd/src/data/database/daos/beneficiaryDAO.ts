import type { BeneficiaryTypeDAO, GenderTypeDAO, IdNationalityTypeDAO as NationalityTypeDAO } from "../typesDAO.ts";

export interface BeneficiaryDAO {
  gender: GenderTypeDAO;
  birthDate: string;
  fullName: string;
  idNationality: NationalityTypeDAO;
  hasId: boolean;
  type: BeneficiaryTypeDAO;
  idState?: number;
  municipalityNumber?: number;
  parishNumber?: number;
}
