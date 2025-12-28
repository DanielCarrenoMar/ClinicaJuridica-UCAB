import type { MunicipalityModel } from "./municipality";

export interface ParishModel {
    municipality: MunicipalityModel;
    idParish: number;
    name: string;
}