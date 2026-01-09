import type { IdNacionalityTypeModel } from "#domain/typesModel.ts";

export interface PersonModel {
    identityCard: string;
    fullName: string;
    idNationality?: IdNacionalityTypeModel;
}