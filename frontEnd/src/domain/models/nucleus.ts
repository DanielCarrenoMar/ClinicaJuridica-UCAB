import type { NucleusDAO } from "#database/daos/NucleusDAO.ts";
export interface NucleusModel {
    idNucleus: string;
    isActive: boolean;
    idState: number;
    municipalityNumber: number;
    parishNumber: number;
}

export function daoToNucleusModel(dao: NucleusDAO): NucleusModel {
    return {
        idNucleus: dao.idNucleus,
        isActive: dao.isActive,
        idState: dao.idState,
        municipalityNumber: dao.municipalityNumber,
        parishNumber: dao.parishNumber
    };
}