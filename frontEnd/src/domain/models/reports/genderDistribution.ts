export interface GenderDistributionModel {
  type: 'Applicants' | 'Beneficiaries';
  gender: string;
  count: number;
}
