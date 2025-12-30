import type { StateDAO } from "#database/daos/StateDAO.ts";
export interface StateModel {
    idState: number;
    name: string;
}

export function daoToStateModel(dao: StateDAO): StateModel {
    return {
        idState: dao.idState,
        name: dao.name
    };
}
