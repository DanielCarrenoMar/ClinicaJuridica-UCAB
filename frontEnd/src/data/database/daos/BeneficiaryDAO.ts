import type { BeneficiaryTypeDAO, GenderDAO, IdTypeDAO } from "./typesDAO.ts";

export interface BeneficiaryDAO {
  identityCard: string;
  gender: GenderDAO;
  birthDate: Date;
  name: string;
  idType: IdTypeDAO;
  hasId: boolean;
  type: BeneficiaryTypeDAO;
  idState?: number;
  municipalityNumber?: number;
  parishNumber?: number;
}
