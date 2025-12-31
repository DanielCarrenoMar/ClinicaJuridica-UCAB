import type { CaseActionDAO } from "#database/daos/caseActionDAO.ts";
import type { CaseDAO } from "#database/daos/caseDAO.ts";
import type { CaseStatusDAO } from "#database/daos/caseStatusDAO.ts";
import type { ApplicantModel } from "./models/applicant"
import type { BeneficiaryModel } from "./models/beneficiary";
import type { CaseModel } from "./models/case";
import type { CaseActionModel } from "./models/caseAction";
import type { CaseStatusModel } from "./models/caseStatus";
import type { StatusCaseAmountModel } from "./models/statusCaseAmount";
import type { StudentModel } from "./models/student";

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
    findCaseById(id: string): Promise<CaseModel | null>;
    findBeneficiariesByCaseId(idCase: number): Promise<BeneficiaryModel[]>;
    findCaseStatusByCaseId(idCase: number): Promise<CaseStatusModel[]>;
    findStudentsByCaseId(idCase: number): Promise<StudentModel[]>;
    getStatusCaseAmount(): Promise<StatusCaseAmountModel[]>;
    createCase(data: CaseDAO): Promise<CaseDAO>;
    createCaseStatusFromCaseId(data: CaseStatusDAO): Promise<CaseStatusDAO>;
    updateCase(id: string, data: Partial<CaseModel>): Promise<CaseModel>;
    deleteCase(id: string): Promise<void>;
}

export interface CaseActionRepository {
    findAllCaseActions(): Promise<CaseActionModel[]>;
    findCaseActionById(id: string): Promise<CaseActionModel | null>;
    createCaseAction(data: CaseActionDAO): Promise<CaseActionDAO>;
}

export interface UserRepository {
    findUserById(id: string): Promise<any | null>;
}

export interface StudentRepository {
    findStudentById(id: string): Promise<any | null>;
}

export interface TeacherRepository {
    findTeacherById(id: string): Promise<any | null>;
}