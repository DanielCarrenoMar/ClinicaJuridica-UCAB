import type { BeneficiaryTypeDAO, GenderDAO, IdTypeDAO as NationalityTypeDAO } from "./typesDAO.ts";

export interface BeneficiaryDAO {
  identityCard: string;
  gender: GenderDAO;
  birthDate: Date;
  name: string;
  idNacionality: NationalityTypeDAO;
  hasId: boolean;
  type: BeneficiaryTypeDAO;
  idState?: number;
  municipalityNumber?: number;
  parishNumber?: number;
}
