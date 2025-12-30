import type { StateModel } from "./state";
import type { MunicipalityDAO } from "#database/daos/MunicipalityDAO.ts";
export interface MunicipalityModel extends StateModel {
    idMunicipality: number;
    name: string;
}

export function daoToMunicipalityModel(dao: MunicipalityDAO): MunicipalityModel {
    return {
        idMunicipality: dao.municipalityNumber,
        name: dao.name,
        idState: dao.idState,
    };
}