import type { StateDistribution } from "#database/daos/reports/stateDistributionDAO.ts";
import type { BeneficiaryTypeModel } from "#domain/typesModel.ts";

export interface StateDistributionModel {
  type: BeneficiaryTypeModel;
  state: string;
  count: number;
}

export function stateDistributionDAOToModel(dao: StateDistribution): StateDistributionModel {
  return {
    type: dao.type === 'Applicants' ? 'Solicitante' : 'Beneficiario',
    state: dao.state,
    count: dao.count,
  };
}
