import type { Applicant } from "./models/applicant"

export interface ApplicantRepository {
    findAll(): Promise<Applicant[]>;
    
    findById(id: string): Promise<Applicant | null>;
    
    create(data: Omit<Applicant, 'id'>): Promise<Applicant>;
    
    update(id: string, data: Partial<Applicant>): Promise<Applicant>;
    
    delete(id: string): Promise<void>;
}