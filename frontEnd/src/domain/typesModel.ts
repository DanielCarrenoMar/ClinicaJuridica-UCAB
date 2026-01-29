import type { CaseStatusTypeDAO, GenderTypeDAO, MaritalStatusTypeDAO, ProcessTypeDAO, AppointmentStatusTypeDAO, CaseBeneficiaryTypeDAO, BeneficiaryTypeDAO, UserTypeDAO, TeacherTypeDAO, StudentTypeDAO } from "#database/typesDAO.ts";
import type { AppointmentStatusTypeDTO, BeneficiaryTypeDTO, CaseBeneficiaryTypeDTO, CaseStatusTypeDTO, GenderTypeDTO, MaritalStatusTypeDTO, ProcessTypeDTO, StudentTypeDTO, TeacherTypeDTO, UserTypeDTO } from "@app/shared/typesDTO";

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
export type CaseBeneficiaryTypeModel = "Directo" | "Indirecto";
export type BeneficiaryTypeModel = "Beneficiario" | "Solicitante";
export type UserTypeModel = "Coordinador" | "Profesor" | "Estudiante";
export type TeacherTypeModel = "REGULAR" | "VOLUNTEER";
export type StudentTypeModel = "regular" | "volunteer" | "graduate" | "service";

export function typeDtoToGenderTypeModel(gender: GenderTypeDTO): GenderTypeModel {
    switch (gender) {
        case 'M':
            return 'Masculino';
        case 'F':
            return 'Femenino';
    }
}
export function typeModelToGenderTypeDto(gender: GenderTypeModel): GenderTypeDTO {
    switch (gender) {
        case 'Masculino':
            return 'M';
        case 'Femenino':
            return 'F';
    }
}

export function typeDtoToMaritalStatusTypeModel(dto: MaritalStatusTypeDTO): MaritalStatusTypeModel {
    switch (dto) {
        case "SINGLE":
            return "Soltero";
        case "MARRIED":
            return "Casado";
        case "DIVORCED":
            return "Divorciado";
        case "WIDOWED":
            return "Viudo";
    }
}
export function typeModelToMaritalStatusTypeDto(model: MaritalStatusTypeModel): MaritalStatusTypeDTO {
    switch (model) {
        case "Soltero":
            return "SINGLE";
        case "Casado":
            return "MARRIED";
        case "Divorciado":
            return "DIVORCED";
        case "Viudo":
            return "WIDOWED";
    }
}

export function typeDtoToProcessTypeModel(dto: ProcessTypeDTO): ProcessTypeModel {
    switch (dto) {
        case "ADVICE":
            return "Asesoria";
        case "MEDIATION":
            return "Conciliacion y mediacion";
        case "DRAFTING":
            return "Redaccion";
        case "IN_PROGRESS":
            return "Tramite";
    }
}
export function typeModelToProcessTypeDto(processTypeModel: ProcessTypeModel): ProcessTypeDTO {
    switch (processTypeModel) {
        case "Asesoria":
            return "ADVICE";
        case "Conciliacion y mediacion":
            return "MEDIATION";
        case "Redaccion":
            return "DRAFTING";
        case "Tramite":
            return "IN_PROGRESS";
    }
}

export function typeDtoToCaseStatusTypeModel(dto: CaseStatusTypeDTO): CaseStatusTypeModel {
    switch (dto) {
        case "OPEN":
            return "Abierto";
        case "IN_PROGRESS":
            return "En Espera";
        case "PAUSED":
            return "Pausado";
        case "CLOSED":
            return "Cerrado";
    }
}
export function typeModelToCaseStatusTypeDto(caseStatusModel: CaseStatusTypeModel): CaseStatusTypeDTO {
    switch (caseStatusModel) {
        case "Abierto":
            return "OPEN";
        case "En Espera":
            return "IN_PROGRESS";
        case "Pausado":
            return "PAUSED";
        case "Cerrado":
            return "CLOSED";
    }
}

export function typeDtoToAppointmentStatusTypeModel(dto: AppointmentStatusTypeDTO): AppointmentStatusTypeModel {
    switch (dto) {
        case "COMPLETED":
            return "Completada";
        case "SCHEDULED":
            return "Programada";
        case "CANCELLED":
            return "Cancelada";
    }
}
export function typeModelToAppointmentStatusTypeDto(appointmentStatusModel: AppointmentStatusTypeModel): AppointmentStatusTypeDTO {
    switch (appointmentStatusModel) {
        case "Completada":
            return "COMPLETED";
        case "Programada":
            return "SCHEDULED";
        case "Cancelada":
            return "CANCELLED";
    }
}

export function typeDtoToCaseBeneficiaryTypeModel(type: CaseBeneficiaryTypeDTO): CaseBeneficiaryTypeModel {
    switch (type) {
        case "DIRECT":
            return "Directo";
        case "INDIRECT":
            return "Indirecto";
    }
}
export function typeModelToCaseBeneficiaryTypeDto(type: CaseBeneficiaryTypeModel): CaseBeneficiaryTypeDTO {
    switch (type) {
        case "Directo":
            return "DIRECT";
        case "Indirecto":
            return "INDIRECT";
    }
}

export function typeDtoToBeneficiaryTypeModel(type: BeneficiaryTypeDTO): BeneficiaryTypeModel {
    switch (type) {
        case "BENEFICIARY":
            return "Beneficiario";
        case "APPLICANT":
            return "Solicitante";
    }
}

export function typeModelToBeneficiaryTypeDto(type: BeneficiaryTypeModel): BeneficiaryTypeDTO {
    switch (type) {
        case "Beneficiario":
            return "BENEFICIARY";
        case "Solicitante":
            return "APPLICANT";
    }
}

export function typeDtoToUserTypeModel(dto: UserTypeDTO): UserTypeModel {
    switch (dto) {
        case "STUDENT":
            return "Estudiante";
        case "COORDINATOR":
            return "Coordinador";
        case "TEACHER":
            return "Profesor";
    }
}
export function typeModelToUserTypeDao(model: UserTypeModel): UserTypeDAO {
    switch (model) {
        case "Estudiante":
            return "E";
        case "Coordinador":
            return "C";
        case "Profesor":
            return "P";
    }
}

export function typeDtoToTeacherTypeModel(dto: TeacherTypeDTO): TeacherTypeModel {
    switch (dto) {
        case "REGULAR":
            return "REGULAR";
        case "VOLUNTEER":
            return "VOLUNTEER";
    }
}
export function typeModelToTeacherTypeDto(model: TeacherTypeModel): TeacherTypeDTO {
    switch (model) {
        case "REGULAR":
            return "REGULAR";
        case "VOLUNTEER":
            return "VOLUNTEER";
    }
}

export function typeDtoToStudentTypeModel(dto: StudentTypeDTO): StudentTypeModel {
    switch (dto) {
        case "REGULAR":
            return "regular";
        case "VOLUNTEER":
            return "volunteer";
        case "GRADUATE":
            return "graduate";
        case "SERVICE":
            return "service";
    }
}
export function typeModelToStudentTypeDto(model: StudentTypeModel): StudentTypeDTO {
    switch (model) {
        case "regular":
            return "REGULAR";
        case "volunteer":
            return "VOLUNTEER";
        case "graduate":
            return "GRADUATE";
        case "service":
            return "SERVICE";
    }
}