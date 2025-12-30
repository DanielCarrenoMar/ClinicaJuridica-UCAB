import type { BeneficiaryTypeDAO, GenderDAO, IdTypeDAO as NationalityTypeDAO } from "./typesDAO.ts";

export interface BeneficiaryDAO {
  identityCard: string;
  gender: GenderDAO;
  birthDate: Date;
  name: string;
  idType: NationalityTypeDAO;
  hasId: boolean;
  type: BeneficiaryTypeDAO;
  idState?: number;
  stateName?: string;
  municipalityNumber?: number;
  municipalityName?: string;
  parishNumber?: number;
  parishName?: string;
}
