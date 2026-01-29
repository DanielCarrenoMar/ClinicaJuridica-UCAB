import type{ GenderTypeDTO } from "@app/shared/typesDTO";

export interface GenderDistribution {
  type: 'Applicants' | 'Beneficiaries';
  gender: GenderTypeDTO;
  count: number;
}
