import type{ CaseBeneficiaryTypeDTO } from "@app/shared/typesDTO";

export interface BeneficiaryTypeDistribution {
  type: CaseBeneficiaryTypeDTO; 
  count: number;
}
