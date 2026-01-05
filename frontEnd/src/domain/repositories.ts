import type { CaseActionDAO } from "#database/daos/caseActionDAO.ts";
import type { CaseDAO } from "#database/daos/caseDAO.ts";
import type { CaseStatusDAO } from "#database/daos/caseStatusDAO.ts";
import type { AppointmentDAO } from "#database/daos/appointmentDAO.ts";
import type { SupportDocumentDAO } from "#database/daos/supportDocumentDAO.ts";
import type { ApplicantModel } from "./models/applicant"
import type { BeneficiaryModel } from "./models/beneficiary";
import type { CaseModel } from "./models/case";
import type { CaseActionModel } from "./models/caseAction";
import type { CaseStatusModel } from "./models/caseStatus";
import type { StatusCaseAmountModel } from "./models/statusCaseAmount";
import type { StudentModel } from "./models/student";
import type { AppointmentModel } from "./models/appointment";
import type { SupportDocumentModel } from "./models/supportDocument";
import type { UserModel } from "./models/user";
import type { TeacherModel } from "./models/teacher";
export interface BeneficiaryRepository {
    findAllBeneficiaries(): Promise<BeneficiaryModel[]>;
    findBeneficiaryById(id: string): Promise<BeneficiaryModel | null>;
    createBeneficiary(data: BeneficiaryModel): Promise<BeneficiaryModel>;
    updateBeneficiary(id: string, data: Partial<BeneficiaryModel>): Promise<BeneficiaryModel>;
    deleteBeneficiary(id: string): Promise<void>;
}

export interface ApplicantRepository {
    findApplicantById(id: string): Promise<ApplicantModel | null>;
    createApplicant(data: ApplicantModel): Promise<ApplicantModel>;
    updateApplicant(id: string, data: Partial<ApplicantModel>): Promise<ApplicantModel>;
    deleteApplicant(id: string): Promise<void>;
}

export interface CaseRepository {
    findAllCases(): Promise<CaseModel[]>;
    findCaseById(id: number): Promise<CaseModel | null>;
    findBeneficiariesByCaseId(idCase: number): Promise<BeneficiaryModel[]>;
    findCaseStatusByCaseId(idCase: number): Promise<CaseStatusModel[]>;
    findStudentsByCaseId(idCase: number): Promise<StudentModel[]>;
    getStatusCaseAmount(): Promise<StatusCaseAmountModel[]>;
    createCase(data: CaseDAO): Promise<CaseModel>;
    createCaseStatusFromCaseId(id: number, data: CaseStatusDAO): Promise<CaseStatusModel>;
    updateCase(id: number, data: Partial<CaseDAO>): Promise<CaseModel>;
    deleteCase(id: number): Promise<void>;
    findStatusCaseAmounts(): Promise<StatusCaseAmountModel>;
    findCaseActionsByCaseId(idCase: number): Promise<CaseActionModel[]>;
    findAppointmentByCaseId(idCase: number): Promise<AppointmentModel[]>;
    findSupportDocumentByCaseId(idCase: number): Promise<SupportDocumentModel[]>;
    addStudentToCase(idCase: number, identityCard: string): Promise<void>;
    removeStudentFromCase(idCase: number, identityCard: string): Promise<void>;
    addBeneficiaryToCase(idCase: number, idBeneficiary: string): Promise<void>;
    removeBeneficiaryFromCase(idCase: number, idBeneficiary: string): Promise<void>;
}

export interface CaseActionRepository {
    findAllCaseActions(): Promise<CaseActionModel[]>;
    findCaseActionById(id: string): Promise<CaseActionModel | null>;
    createCaseAction(data: CaseActionDAO): Promise<CaseActionModel>;
}


export interface AppointmentRepository {
    findAllAppointments(): Promise<AppointmentModel[]>;
    findAppointmentById(id: number): Promise<AppointmentModel | null>;
    createAppointment(data: AppointmentDAO): Promise<AppointmentModel>;
    updateAppointment(id: number, data: Partial<AppointmentModel>): Promise<AppointmentModel>;
    deleteAppointment(idCase: number, appointmentNumber: number): Promise<void>;
}

export interface SupportDocumentRepository {
    findAllSupportDocuments(): Promise<SupportDocumentModel[]>;
    findSupportDocumentById(id: number): Promise<SupportDocumentModel | null>;
    createSupportDocument(data: SupportDocumentDAO): Promise<SupportDocumentModel>;
    updateSupportDocument(id: number, data: Partial<SupportDocumentModel>): Promise<SupportDocumentModel>;
    deleteSupportDocument(idCase: number, supportNumber: number): Promise<void>;
}

export interface UserRepository {
    findAllUsers(): Promise<UserModel[]>;
    findUserById(id: string): Promise<UserModel | null>;
}

export interface StudentRepository {
    findAllStudents(): Promise<StudentModel[]>;
    findStudentById(id: string): Promise<StudentModel | null>;
}

export interface TeacherRepository {
    findAllTeachers(): Promise<TeacherModel[]>;
    findTeacherById(id: string): Promise<TeacherModel | null>;
}