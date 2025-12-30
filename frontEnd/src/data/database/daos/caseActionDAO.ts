export interface CaseActionDAO {
  idCase: number;
  actionNumber: number;
  description: string;
  notes?: string;
  userId: string;
  userName: string;
  registryDate: Date;
}
