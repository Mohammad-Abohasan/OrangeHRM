export interface ICreateEmployeeSalaryComponentsPayload {
  salaryComponent: string;
  salaryAmount: string;
  payGradeId: number;
  currencyId: string;
  payFrequencyId: string;
  comment: string;
  addDirectDeposit: boolean;
}
