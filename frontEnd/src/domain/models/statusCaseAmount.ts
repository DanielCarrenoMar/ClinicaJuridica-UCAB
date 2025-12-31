import type { StatusCaseAmountDAO } from "#database/daos/statusCaseAmountDAO.ts";

export interface StatusCaseAmountModel {
    proccessAmount: number;
    adviceAmount: number;
    mediationAmount: number;
    draftingAmount: number;
}

export function daoToStatusCaseAmountModel(dao: StatusCaseAmountDAO): StatusCaseAmountModel {
    return dao as StatusCaseAmountModel;
}