import type { StatusCaseAmountDAO } from "#database/daos/statusCaseAmountDAO.ts";

export interface StatusCaseAmountModel {
    openAmount: number;
    closedAmount: number;
    inProgressAmount: number;
    pausedAmount: number;
}

export function daoToStatusCaseAmountModel(dao: StatusCaseAmountDAO): StatusCaseAmountModel {
    return dao as StatusCaseAmountModel;
}