export interface IUpdateEmployeeJobDetailsResponse {
  data: Data;
  meta: any[];
  rels: any[];
}

export interface Data {
  empNumber: number;
  joinedDate: null;
  jobTitle: JobTitle;
  jobSpecificationAttachment: JobSpecificationAttachment;
  empStatus: EmpStatus;
  jobCategory: EmpStatus;
  subunit: Subunit;
  location: EmpStatus;
  employeeTerminationRecord: EmployeeTerminationRecord;
}

export interface EmpStatus {
  id: number;
  name: string;
}

export interface EmployeeTerminationRecord {
  id: null;
  date: string;
}

export interface JobSpecificationAttachment {
  id: number;
  filename: string;
}

export interface JobTitle {
  id: number;
  title: string;
  isDeleted?: boolean;
}

export interface Subunit {
  id: number;
  name: string;
  unitId: string;
}
