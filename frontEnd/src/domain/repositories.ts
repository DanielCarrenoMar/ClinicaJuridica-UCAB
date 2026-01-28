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
import type { SemesterModel } from "./models/semester";
import type { NucleusModel } from "./models/nucleus";
import type { NucleusDAO } from "#database/daos/nucleusDAO.ts";
import type { SemesterDAO } from "#database/daos/semesterDAO.ts";

import type { CasesBySubjectModel } from "./models/reports/casesBySubject";
import type { CasesBySubjectScopeModel } from "./models/reports/casesBySubjectScope";
import type { GenderDistributionModel } from "./models/reports/genderDistribution";
import type { StateDistributionModel } from "./models/reports/stateDistribution";
import type { ParishDistributionModel } from "./models/reports/parishDistribution";
import type { CasesByTypeModel } from "./models/reports/casesByType";
import type { BeneficiariesByParishModel } from "./models/reports/beneficiariesByParish";
import type { StudentInvolvementModel } from "./models/reports/studentInvolvement";
import type { CasesByServiceTypeModel } from "./models/reports/casesByServiceType";
import type { ProfessorInvolvementModel } from "./models/reports/professorInvolvement";
import type { BeneficiaryTypeDistributionModel } from "./models/reports/beneficiaryTypeDistribution";

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
    findBeneficiariesByCaseId(idCase: number, params?: { page?: number; limit?: number }): Promise<CaseBeneficiaryModel[]>;
    findStudentsByCaseId(idCase: number, params?: { page?: number; limit?: number }): Promise<StudentModel[]>;
    getStatusCaseAmount(): Promise<StatusCaseAmountModel[]>;
    createCase(data: CaseDAO): Promise<CaseModel>;
    createCaseStatusFromCaseId(id: number, data: CaseStatusDAO): Promise<CaseStatusModel>;
    updateCase(id: number, data: Partial<CaseDAO>): Promise<CaseModel>;
    deleteCase(id: number): Promise<void>;
    findStatusCaseAmounts(): Promise<StatusCaseAmountModel>;
    findCaseActionsByCaseId(idCase: number, params?: { page?: number; limit?: number }): Promise<CaseActionModel[]>;
    findAppointmentByCaseId(idCase: number, params?: { page?: number; limit?: number }): Promise<AppointmentModel[]>;
    findSupportDocumentByCaseId(idCase: number, params?: { page?: number; limit?: number }): Promise<SupportDocumentModel[]>;
    addStudentToCase(idCase: number, identityCard: string): Promise<void>;
    removeStudentFromCase(idCase: number, identityCard: string): Promise<void>;
    addBeneficiaryToCase(idCase: number, idBeneficiary: string, caseType: CaseBeneficiaryTypeDAO, relationship: string, description: string): Promise<void>;
    removeBeneficiaryFromCase(idCase: number, idBeneficiary: string): Promise<void>;
}

export interface CaseActionRepository {
    findAllCaseActions(params?: { page?: number; limit?: number }): Promise<CaseActionModel[]>;
    findCaseActionById(id: string): Promise<CaseActionModel | null>;
    createCaseAction(data: CaseActionDAO): Promise<CaseActionModel>;
    findActionsByUserId(userId: string, params?: { page?: number; limit?: number }): Promise<CaseActionModel[]>;
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
    findActualUser(): Promise<UserModel | null>;
    createUser(data: UserDAO): Promise<any>;
}

export interface StudentRepository {
    findAllStudents(params?: { page?: number; limit?: number }): Promise<StudentModel[]>;
    findStudentById(id: string): Promise<StudentModel | null>;
    updateStudent(id: string, data: Partial<StudentDAO>): Promise<StudentModel>;
    getCasesByStudentId(id: string, params?: { page?: number; limit?: number }): Promise<CaseModel[]>;
    importStudents(file: File): Promise<any>;
    createStudent(data: Omit<StudentDAO, 'term'>): Promise<any>;
}

export interface TeacherRepository {
    findAllTeachers(params?: { page?: number; limit?: number }): Promise<TeacherModel[]>;
    findTeacherById(id: string): Promise<TeacherModel | null>;
    updateTeacher(id: string, data: Partial<TeacherDAO>): Promise<TeacherModel>;
    getCasesByTeacherId(id: string, params?: { page?: number; limit?: number }): Promise<CaseModel[]>;
    createTeacher(data: Omit<TeacherDAO, 'term'>): Promise<any>;
}

export interface SemesterRepository {
    findAllSemesters(): Promise<SemesterModel[]>;
    findCurrentSemester(): Promise<SemesterModel | null>;
    findSemesterById(term: string): Promise<SemesterModel | null>;
    createSemester(data: SemesterDAO): Promise<SemesterModel>;
    updateSemester(term: string, data: Partial<SemesterDAO>): Promise<SemesterModel>;
    deleteSemester(term: string): Promise<void>;
}

export interface NucleusRepository {
    findAllNuclei(): Promise<NucleusModel[]>;
    findNucleusById(id: string): Promise<NucleusModel | null>;
    createNucleus(data: NucleusDAO): Promise<NucleusModel>;
    updateNucleus(id: string, data: Partial<NucleusDAO>): Promise<NucleusModel>;
    deleteNucleus(id: string): Promise<void>;
}

export interface ReportRepository {
    getCasesBySubject(startDate?: Date, endDate?: Date): Promise<CasesBySubjectModel[]>;
    getCasesBySubjectScope(startDate?: Date, endDate?: Date): Promise<CasesBySubjectScopeModel[]>;
    getGenderDistribution(startDate?: Date, endDate?: Date): Promise<GenderDistributionModel[]>;
    getStateDistribution(startDate?: Date, endDate?: Date): Promise<StateDistributionModel[]>;
    getParishDistribution(startDate?: Date, endDate?: Date): Promise<ParishDistributionModel[]>;
    getCasesByType(startDate?: Date, endDate?: Date): Promise<CasesByTypeModel[]>;
    getBeneficiariesByParish(startDate?: Date, endDate?: Date): Promise<BeneficiariesByParishModel[]>;
    getStudentInvolvement(startDate?: Date, endDate?: Date): Promise<StudentInvolvementModel[]>;
    getCasesByServiceType(startDate?: Date, endDate?: Date): Promise<CasesByServiceTypeModel[]>;
    getProfessorInvolvement(startDate?: Date, endDate?: Date): Promise<ProfessorInvolvementModel[]>;
    getBeneficiaryTypeDistribution(startDate?: Date, endDate?: Date): Promise<BeneficiaryTypeDistributionModel[]>;
}