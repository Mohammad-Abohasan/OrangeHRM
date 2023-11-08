export interface ICreateEventPayload {
  data: Data;
  meta: any[];
  rels: any[];
}

export interface Data {
  id: number;
  name: string;
  description: string;
  status: boolean;
}
