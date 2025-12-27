import type { Applicant } from "./models/applicant"
import type { Beneficiary } from "./models/beneficiary";

export interface BeneficiaryRepository {
    findAllBeneficiaries(): Promise<Beneficiary[]>;
    findBeneficiaryById(id: string): Promise<Beneficiary | null>;
    createBeneficiary(data: Beneficiary): Promise<Beneficiary>;
    updateBeneficiary(id: string, data: Partial<Beneficiary>): Promise<Beneficiary>;
    deleteBeneficiary(id: string): Promise<void>;
}

export interface ApplicantRepository {
    findAll(): Promise<Applicant[]>;
    
    findById(id: string): Promise<Applicant | null>;
    
    create(data: Omit<Applicant, 'id'>): Promise<Applicant>;
    
    update(id: string, data: Partial<Applicant>): Promise<Applicant>;
    
    delete(id: string): Promise<void>;
}