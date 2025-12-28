import type { ApplicantModel } from "./models/applicant"
import type { BeneficiaryModel } from "./models/beneficiary";

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