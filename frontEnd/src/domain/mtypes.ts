import type { GenderDAO } from "#database/typesDAO.ts";

export type IdNacionality = "V" | "E" | "J";
export type IDType = 'V' | 'E' | 'J';
export type PersonID = string;
export type GenderType = 'male' | 'female';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type ProcessType = 
    "in progress" |  // Tramite
    "advice" |  // Asesoria
    "mediation" |  // Conciliacion y mediacion
    "drafting";  // Redaccion

export function modelGenderToDao(gender: GenderType): GenderDAO {
    switch (gender) {
        case 'male':
            return 'M';
        case 'female':
            return 'F';
    }
}