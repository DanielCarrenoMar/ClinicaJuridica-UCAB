import type { BeneficiaryTypeDTO, GenderTypeDTO, IdNationalityTypeDTO as NationalityTypeDTO } from "../typesDAO.ts";

export interface BeneficiaryDAO {
  identityCard: string;
  gender: GenderTypeDTO;
  birthDate: string;
  fullName: string;
  idNationality: NationalityTypeDTO;
  hasId: boolean;
  type: BeneficiaryTypeDTO;
  idState?: number;
  municipalityNumber?: number;
  parishNumber?: number;
}
