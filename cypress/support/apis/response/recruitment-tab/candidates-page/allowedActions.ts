export interface IGetAllowedActions {
  data: Data[];
  meta: Meta;
  rels: any[];
}

export interface Data {
  id: string;
  label: string;
}

export interface Meta {
  total: number;
}
