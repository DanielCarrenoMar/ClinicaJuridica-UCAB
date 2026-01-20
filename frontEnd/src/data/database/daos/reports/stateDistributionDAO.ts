export interface StateDistribution {
  type: 'Applicants' | 'Beneficiaries';
  state: string;
  count: number;
}
