import type { CaseDAO } from "#database/daos/caseDAO.ts";
import type { ApplicantModel } from "./models/applicant"
import type { BeneficiaryModel } from "./models/beneficiary";
import type { CaseModel } from "./models/case";

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
    createCase(data: CaseDAO): Promise<CaseDAO>;
    updateCase(id: string, data: Partial<CaseModel>): Promise<CaseModel>;
    deleteCase(id: string): Promise<void>;
}