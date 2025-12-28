export interface FamilyHomeDAO {
  applicantId: string;
  memberCount?: number;
  workingMemberCount?: number;
  children7to12Count?: number;
  studentChildrenCount?: number;
  monthlyIncome?: string; // decimal as string to preserve precision
}
