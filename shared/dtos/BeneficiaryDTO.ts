import type { BeneficiaryTypeDTO, GenderTypeDTO, IdNationalityTypeDTO } from "@app/shared/typesDTO";


export interface BeneficiaryReqDTO {
  identityCard: string;
  gender: GenderTypeDTO;
  birthDate: string;
  fullName: string;
  idNationality: IdNationalityTypeDTO;
  hasId: boolean;
  type: BeneficiaryTypeDTO;
  idState?: number;
  municipalityNumber?: number;
  parishNumber?: number;
}

export interface BeneficiaryResDTO extends BeneficiaryReqDTO {
  stateName?: string;
  municipalityName?: string;
  parishName?: string;
}