export interface ICreateJobTitleResponse {
  data: Data;
  meta: any[];
  rels: any[];
}

export interface Data {
  id: number;
  title: string;
  description: string;
  note: string;
  jobSpecification: JobSpecification;
}

export interface JobSpecification {
  id: number;
  filename: string;
  fileType: string;
  fileSize: string;
}
