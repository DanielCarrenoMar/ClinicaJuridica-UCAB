import type { NucleusInfoDAO } from "#database/daos/nucleusInfoDAO.ts";

export interface NucleusModel {
    idNucleus: string;
    isActive: boolean;
    idState: number;
    municipalityNumber: number;
    parishNumber: number;
    stateName: string;
    municipalityName: string;
    parishName: string;
    caseCount: number;
}

export function daoToNucleusModel(dao: NucleusInfoDAO): NucleusModel {
    return {
        idNucleus: dao.idNucleus,
        isActive: dao.isActive,
        idState: dao.idState,
        municipalityNumber: dao.municipalityNumber,
        parishNumber: dao.parishNumber,
        stateName: dao.stateName,
        municipalityName: dao.municipalityName,
        parishName: dao.parishName,
        caseCount: dao.caseCount ?? 0,
    };
}
