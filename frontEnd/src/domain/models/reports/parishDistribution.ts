export interface ParishDistributionModel {
  type: 'Applicants' | 'Beneficiaries';
  parish: string;
  count: number;
}
