import type { CaseStatusTypeDAO, GenderTypeDAO, MaritalStatusTypeDAO, ProcessTypeDAO } from "#database/typesDAO.ts";

export type IdNacionalityTypeModel = "V" | "E" | "J";
export type IDTypeModel = 'V' | 'E' | 'J';
export type GenderTypeModel = 'male' | 'female';
export type MaritalStatusTypeModel = 'single' | 'married' | 'divorced' | 'widowed';
export type ProcessTypeModel = 
    "in progress" |  // Tramite
    "advice" |  // Asesoria
    "mediation" |  // Conciliacion y mediacion
    "drafting";  // Redaccion
export type CaseStatusTypeModel = "OPEN" | "IN_PROGRESS" | "PAUSED" | "CLOSED";

export function typeDaoToGenderTypeModel(gender: GenderTypeDAO): GenderTypeModel {
    switch (gender) {
        case 'M':
            return 'male';
        case 'F':
            return 'female';
    }
}
export function typeModelToGenderTypeDao(gender: GenderTypeModel): GenderTypeDAO {
    switch (gender) {
        case 'male':
            return 'M';
        case 'female':
            return 'F';
    }
}

export function typeDaoToMaritalStatusTypeModel(dao: MaritalStatusTypeDAO): MaritalStatusTypeModel {
    switch (dao) {
        case "S":
            return "single";
        case "C":
            return "married";
        case "D":
            return "divorced";
        case "V":
            return "widowed";
    }
}
export function typeModelToMaritalStatusTypeDao(model: MaritalStatusTypeModel): MaritalStatusTypeDAO {
    switch (model) {
        case "single":
            return "S";
        case "married":
            return "C";
        case "divorced":
            return "D";
        case "widowed":
            return "V";
    }
}

export function typeDaoToProcessTypeModel(processTypeDAO: ProcessTypeDAO): ProcessTypeModel {
    switch (processTypeDAO) {
        case "A":
            return "advice";
        case "CM":
            return "mediation";
        case "R":
            return "drafting";
        case "T":
            return "in progress";
    }
}
export function typeModelToProcessTypeDao(processTypeModel: ProcessTypeModel): ProcessTypeDAO {
    switch (processTypeModel) {
        case "advice":
            return "A";
        case "mediation":
            return "CM";
        case "drafting":
            return "R";
        case "in progress":
            return "T";
    }
}

export function typeDaoToCaseStatusTypeModel(caseStatusDAO: CaseStatusTypeDAO): CaseStatusTypeModel {
    switch (caseStatusDAO) {
        case "A":
            return "OPEN";
        case "T":
            return "IN_PROGRESS";
        case "P":
            return "PAUSED";
        case "C":
            return "CLOSED";
    }
}
export function typeModelToCaseStatusTypeDao(caseStatusModel: CaseStatusTypeModel): CaseStatusTypeDAO {
    switch (caseStatusModel) {
        case "OPEN":
            return "A";
        case "IN_PROGRESS":
            return "T";
        case "PAUSED":
            return "P";
        case "CLOSED":
            return "C";
    }
}