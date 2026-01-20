import type { CaseBeneficiaryTypeModel } from "#domain/typesModel.ts";
import { typeDaoToCaseBeneficiaryTypeModel } from "#domain/typesModel.ts";
import type { BeneficiaryTypeDistribution } from "#database/daos/reports/beneficiaryTypeDistributionDAO.ts";

export interface BeneficiaryTypeDistributionModel {
  type: CaseBeneficiaryTypeModel;
  count: number;
}

export function beneficiaryTypeDistributionDAOToModel(dao: BeneficiaryTypeDistribution): BeneficiaryTypeDistributionModel {
  return {
    type: typeDaoToCaseBeneficiaryTypeModel(dao.type),
    count: dao.count,
  };
}
