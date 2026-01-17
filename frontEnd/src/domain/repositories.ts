import type { CaseActionDAO } from "#database/daos/caseActionDAO.ts";
import type { CaseDAO } from "#database/daos/caseDAO.ts";
import type { CaseStatusDAO } from "#database/daos/caseStatusDAO.ts";
import type { AppointmentDAO } from "#database/daos/appointmentDAO.ts";
import type { SupportDocumentDAO } from "#database/daos/supportDocumentDAO.ts";
import type { ApplicantModel } from "./models/applicant"
import type { BeneficiaryModel } from "./models/beneficiary";
import type { BeneficiaryDAO } from "#database/daos/beneficiaryDAO.ts";
import type { CaseModel } from "./models/case";
import type { CaseActionModel } from "./models/caseAction";
import type { CaseStatusModel } from "./models/caseStatus";
import type { StatusCaseAmountModel } from "./models/statusCaseAmount";
import type { StudentModel } from "./models/student";
import type { AppointmentModel } from "./models/appointment";
import type { SupportDocumentModel } from "./models/supportDocument";
import type { UserModel } from "./models/user";
import type { TeacherModel } from "./models/teacher";
import type { CaseBeneficiaryModel } from "./models/caseBeneficiary";
import type { CaseBeneficiaryTypeDAO } from "#database/typesDAO.ts";
import type { UserDAO } from "#database/daos/userDAO.ts";
import type { StudentDAO } from "#database/daos/studentDAO.ts";
import type { TeacherDAO } from "#database/daos/teacherDAO.ts";
export interface BeneficiaryRepository {
    findAllBeneficiaries(params?: { page?: number; limit?: number }): Promise<BeneficiaryModel[]>;
    findBeneficiaryById(id: string): Promise<BeneficiaryModel | null>;
    createBeneficiary(data: BeneficiaryDAO): Promise<BeneficiaryModel>;
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
    findAllCases(params?: { page?: number; limit?: number }): Promise<CaseModel[]>;
    findCaseById(id: number): Promise<CaseModel | null>;
    findBeneficiariesByCaseId(idCase: number): Promise<CaseBeneficiaryModel[]>;
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
    addBeneficiaryToCase(idCase: number, idBeneficiary: string, caseType: CaseBeneficiaryTypeDAO, relationship: string, description: string): Promise<void>;
    removeBeneficiaryFromCase(idCase: number, idBeneficiary: string): Promise<void>;
}

export interface CaseActionRepository {
    findAllCaseActions(params?: { page?: number; limit?: number }): Promise<CaseActionModel[]>;
    findCaseActionById(id: string): Promise<CaseActionModel | null>;
    createCaseAction(data: CaseActionDAO): Promise<CaseActionModel>;
    findActionsByUserId(userId: string): Promise<CaseActionModel[]>;
}


export interface AppointmentRepository {
    findAllAppointments(params?: { page?: number; limit?: number }): Promise<AppointmentModel[]>;
    findAppointmentById(id: number): Promise<AppointmentModel | null>;
    createAppointment(data: AppointmentDAO): Promise<AppointmentModel>;
    updateAppointment(id: number, data: Partial<AppointmentDAO>): Promise<AppointmentModel>;
    deleteAppointment(idCase: number, appointmentNumber: number): Promise<void>;
}

export interface SupportDocumentRepository {
    findAllSupportDocuments(params?: { page?: number; limit?: number }): Promise<SupportDocumentModel[]>;
    findSupportDocumentById(id: number): Promise<SupportDocumentModel | null>;
    createSupportDocument(data: SupportDocumentDAO): Promise<SupportDocumentModel>;
    updateSupportDocument(id: number, data: Partial<SupportDocumentDAO>): Promise<SupportDocumentModel>;
    deleteSupportDocument(idCase: number, supportNumber: number): Promise<void>;
}

export interface UserRepository {
    findAllUsers(params?: { page?: number; limit?: number }): Promise<UserModel[]>;
    findUserById(id: string): Promise<UserModel | null>;
    updateUser(id: string, data: Partial<UserDAO>): Promise<UserModel>;
    authenticate(email: string, password: string): Promise<UserModel>;
}

export interface StudentRepository {
    findAllStudents(params?: { page?: number; limit?: number }): Promise<StudentModel[]>;
    findStudentById(id: string): Promise<StudentModel | null>;
    updateStudent(id: string, data: Partial<StudentDAO>): Promise<StudentModel>;
    getCasesByStudentId(id: string): Promise<CaseModel[]>;
    importStudents(file: File): Promise<any>;
}

export interface TeacherRepository {
    findAllTeachers(params?: { page?: number; limit?: number }): Promise<TeacherModel[]>;
    findTeacherById(id: string): Promise<TeacherModel | null>;
    updateTeacher(id: string, data: Partial<TeacherDAO>): Promise<TeacherModel>;
    getCasesByTeacherId(id: string): Promise<CaseModel[]>;
}