import type { PersonID, SexType } from "./globalTypes";

export interface Beneficiary {
    idBeneficiary: PersonID,
    name: string,
    lastName: string,
    sex: SexType
}