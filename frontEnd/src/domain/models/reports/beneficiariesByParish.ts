import type { BeneficiariesByParish } from "#database/daos/reports/beneficiariesByParishDAO.ts";

export interface BeneficiariesByParishModel {
  parish: string;
  count: number;
}

export function beneficiariesByParishDAOToModel(dao: BeneficiariesByParish): BeneficiariesByParishModel {
  return {
    parish: dao.parish,
    count: dao.count,
  };
}
