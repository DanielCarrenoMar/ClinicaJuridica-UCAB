export interface CaseActionDAO {
  idCase: number;
  actionNumber: number;
  description: string;
  notes?: string;
  userId: string;
  registryDate: string;
}
