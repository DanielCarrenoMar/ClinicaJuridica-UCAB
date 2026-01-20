export interface ParishDistribution {
  type: 'Applicants' | 'Beneficiaries';
  parish: string;
  count: number;
}
