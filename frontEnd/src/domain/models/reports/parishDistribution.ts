import type { BeneficiaryTypeModel } from "#domain/typesModel.ts";
import type { ParishDistribution } from "#database/daos/reports/parishDistributionDAO.ts";

export interface ParishDistributionModel {
  type: BeneficiaryTypeModel;
  parish: string;
  count: number;
}

export function parishDistributionDAOToModel(dao: ParishDistribution): ParishDistributionModel {
  return {
    type: dao.type === 'Applicants' ? 'Solicitante' : 'Beneficiario',
    parish: dao.parish,
    count: dao.count,
  };
}
