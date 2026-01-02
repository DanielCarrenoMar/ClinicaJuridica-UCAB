import type { BeneficiaryTypeDAO, GenderDAO, IdTypeDAO as NationalityTypeDAO } from "../typesDAO.ts";

export interface BeneficiaryDAO {
  gender: GenderDAO;
  birthDate: Date;
  fullName: string;
  idNationality: NationalityTypeDAO;
  hasId: boolean;
  type: BeneficiaryTypeDAO;
  idState?: number;
  municipalityNumber?: number;
  parishNumber?: number;
}
