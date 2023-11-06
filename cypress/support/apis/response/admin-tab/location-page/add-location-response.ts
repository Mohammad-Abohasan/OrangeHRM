export interface ICreateLocationResponse {
  data: Data;
  meta: any[];
  rels: any[];
}

export interface Data {
  id: number;
  name: string;
  country: Country;
  province: string;
  city: string;
  address: string;
  zipCode: string;
  phone: string;
  fax: string;
  note: string;
  noOfEmployees: number;
}

export interface Country {
  countryCode: string;
  name: string;
  countryName: string;
}
