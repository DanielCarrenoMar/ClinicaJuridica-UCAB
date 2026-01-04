import type { CaseStatusTypeDAO, GenderTypeDAO, MaritalStatusTypeDAO, ProcessTypeDAO, AppointmentStatusTypeDAO } from "#database/typesDAO.ts";

export type IdNacionalityTypeModel = "V" | "E" | "J";
export type IDTypeModel = 'V' | 'E' | 'J';
export type GenderTypeModel = 'Masculino' | 'Femenino';
export type MaritalStatusTypeModel = 'Soltero' | 'Casado' | 'Divorciado' | 'Viudo';
export type ProcessTypeModel =
    "Tramite" |
    "Asesoria" |
    "Conciliacion y mediacion" |
    "Redaccion";
export type CaseStatusTypeModel = "Abierto" | "En Espera" | "Pausado" | "Cerrado";
export type AppointmentStatusTypeModel = "Completada" | "Programada" | "Cancelada";
export function typeDaoToGenderTypeModel(gender: GenderTypeDAO): GenderTypeModel {
    switch (gender) {
        case 'M':
            return 'Masculino';
        case 'F':
            return 'Femenino';
    }
}
export function typeModelToGenderTypeDao(gender: GenderTypeModel): GenderTypeDAO {
    switch (gender) {
        case 'Masculino':
            return 'M';
        case 'Femenino':
            return 'F';
    }
}

export function typeDaoToMaritalStatusTypeModel(dao: MaritalStatusTypeDAO): MaritalStatusTypeModel {
    switch (dao) {
        case "S":
            return "Soltero";
        case "C":
            return "Casado";
        case "D":
            return "Divorciado";
        case "V":
            return "Viudo";
    }
}
export function typeModelToMaritalStatusTypeDao(model: MaritalStatusTypeModel): MaritalStatusTypeDAO {
    switch (model) {
        case "Soltero":
            return "S";
        case "Casado":
            return "C";
        case "Divorciado":
            return "D";
        case "Viudo":
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
            return "Abierto";
        case "T":
            return "En Espera";
        case "P":
            return "Pausado";
        case "C":
            return "Cerrado";
    }
}
export function typeModelToCaseStatusTypeDao(caseStatusModel: CaseStatusTypeModel): CaseStatusTypeDAO {
    switch (caseStatusModel) {
        case "Abierto":
            return "A";
        case "En Espera":
            return "T";
        case "Pausado":
            return "P";
        case "Cerrado":
            return "C";
    }
}

export function typeDaoToAppointmentStatusTypeModel(appointmentStatusDAO: AppointmentStatusTypeDAO): AppointmentStatusTypeModel {
    switch (appointmentStatusDAO) {
        case "R":
            return "Completada";
        case "P":
            return "Programada";
        case "C":
            return "Cancelada";
    }
}
export function typeModelToAppointmentStatusTypeDao(appointmentStatusModel: AppointmentStatusTypeModel): AppointmentStatusTypeDAO {
    switch (appointmentStatusModel) {
        case "Completada":
            return "R";
        case "Programada":
            return "P";
        case "Cancelada":
            return "C";
    }
}