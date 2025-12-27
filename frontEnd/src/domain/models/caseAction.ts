
export interface CaseActionModel {
    idCase: number;
    actionNumber: number;
    description: string;
    notes: string | null;
    userId: string;
    registryDate: Date;
}