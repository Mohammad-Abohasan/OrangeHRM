export interface ICreateEmployeeSalaryComponentsResponse {
  data: Data;
  meta: Meta;
  rels: any[];
}

export interface Data {
  id: number;
  amount: string;
  salaryName: string;
  comment: string;
  payPeriod: CurrencyType;
  payGrade: PayGrade;
  currencyType: CurrencyType;
  directDebit: DirectDebit;
}

export interface CurrencyType {
  id: string;
  name: string;
}

export interface DirectDebit {
  id: number;
  routingNumber: string;
  account: string;
  amount: string;
  accountType: string;
}

export interface PayGrade {
  id: number;
  name: string;
}

export interface Meta {
  empNumber: number;
}
