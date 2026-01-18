import type { NucleusDAO } from "./nucleusDAO.ts";

export interface NucleusInfoDAO extends NucleusDAO {
    caseCount: number;
    stateName: string;
    municipalityName: string;
    parishName: string;
}
