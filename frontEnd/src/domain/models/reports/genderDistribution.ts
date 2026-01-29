import type { BeneficiaryTypeModel, GenderTypeModel } from "#domain/typesModel.ts";
import { typeDtoToGenderTypeModel } from "#domain/typesModel.ts";
import type { GenderDistribution } from "#database/daos/reports/genderDistributionDAO.ts";

export interface GenderDistributionModel {
  type: BeneficiaryTypeModel;
  gender: GenderTypeModel;
  count: number;
}

export function genderDistributionDAOToModel(dao: GenderDistribution): GenderDistributionModel {
  return {
    type: dao.type == "Applicants" ? "Solicitante" : "Beneficiario",
    gender: typeDtoToGenderTypeModel(dao.gender),
    count: dao.count,
  };
}
