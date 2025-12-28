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
    findAll(): Promise<ApplicantModel[]>;

    findById(id: string): Promise<ApplicantModel | null>;

    create(data: Omit<ApplicantModel, 'id'>): Promise<ApplicantModel>;

    update(id: string, data: Partial<ApplicantModel>): Promise<ApplicantModel>;

    delete(id: string): Promise<void>;
}

export interface CaseRepository {
    findAllCases(): Promise<CaseModel[]>;
    findCaseById(id: string): Promise<CaseModel | null>;
    createCase(data: CaseModel): Promise<CaseModel>;
    updateCase(id: string, data: Partial<CaseModel>): Promise<CaseModel>;
    deleteCase(id: string): Promise<void>;
}