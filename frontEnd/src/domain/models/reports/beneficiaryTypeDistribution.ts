import type { CaseBeneficiaryTypeModel } from "#domain/typesModel.ts";
import { typeDtoToCaseBeneficiaryTypeModel } from "#domain/typesModel.ts";
import type { BeneficiaryTypeDistribution } from "#database/daos/reports/beneficiaryTypeDistributionDAO.ts";

export interface BeneficiaryTypeDistributionModel {
  type: CaseBeneficiaryTypeModel;
  count: number;
}

export function beneficiaryTypeDistributionDAOToModel(dao: BeneficiaryTypeDistribution): BeneficiaryTypeDistributionModel {
  return {
    type: typeDtoToCaseBeneficiaryTypeModel(dao.type),
    count: dao.count,
  };
}
