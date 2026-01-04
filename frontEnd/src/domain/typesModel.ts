import type { CaseStatusTypeDAO, GenderTypeDAO, MaritalStatusTypeDAO, ProcessTypeDAO, AppointmentStatusTypeDAO } from "#database/typesDAO.ts";

export type IdNacionalityTypeModel = "V" | "E" | "J";
export type IDTypeModel = 'V' | 'E' | 'J';
export type GenderTypeModel = 'male' | 'female';
export type MaritalStatusTypeModel = 'single' | 'married' | 'divorced' | 'widowed';
export type ProcessTypeModel =
    "Tramite" |
    "Asesoria" |
    "Conciliacion y mediacion" |
    "Redaccion";
export type CaseStatusTypeModel = "OPEN" | "IN_PROGRESS" | "PAUSED" | "CLOSED";
export type AppointmentStatusTypeModel = "COMPLETED" | "SCHEDULED" | "CANCELLED";
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
            return "Asesoria";
        case "CM":
            return "Conciliacion y mediacion";
        case "R":
            return "Redaccion";
        case "T":
            return "Tramite";
    }
}
export function typeModelToProcessTypeDao(processTypeModel: ProcessTypeModel): ProcessTypeDAO {
    switch (processTypeModel) {
        case "Asesoria":
            return "A";
        case "Conciliacion y mediacion":
            return "CM";
        case "Redaccion":
            return "R";
        case "Tramite":
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

export function typeDaoToAppointmentStatusTypeModel(appointmentStatusDAO: AppointmentStatusTypeDAO): AppointmentStatusTypeModel {
    switch (appointmentStatusDAO) {
        case "R":
            return "COMPLETED";
        case "P":
            return "SCHEDULED";
        case "C":
            return "CANCELLED";
    }
}
export function typeModelToAppointmentStatusTypeDao(appointmentStatusModel: AppointmentStatusTypeModel): AppointmentStatusTypeDAO {
    switch (appointmentStatusModel) {
        case "COMPLETED":
            return "R";
        case "SCHEDULED":
            return "P";
        case "CANCELLED":
            return "C";
    }
}