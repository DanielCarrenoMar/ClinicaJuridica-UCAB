import type { BeneficiaryTypeModel, GenderTypeModel } from "#domain/typesModel.ts";
import { typeDaoToGenderTypeModel } from "#domain/typesModel.ts";
import type { GenderDistribution } from "#database/daos/reports/genderDistributionDAO.ts";

export interface GenderDistributionModel {
  type: BeneficiaryTypeModel;
  gender: GenderTypeModel;
  count: number;
}

export function genderDistributionDAOToModel(dao: GenderDistribution): GenderDistributionModel {
  return {
    type: dao.type == "Applicants" ? "Solicitante" : "Beneficiario",
    gender: typeDaoToGenderTypeModel(dao.gender),
    count: dao.count,
  };
}
