export interface StateDistributionModel {
  type: 'Applicants' | 'Beneficiaries';
  state: string;
  count: number;
}
