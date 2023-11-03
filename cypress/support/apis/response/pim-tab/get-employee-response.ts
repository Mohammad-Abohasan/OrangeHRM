export interface IGetEmployeeResponse {
  data: [
    {
      empNumber: number;
      lastName: string;
      firstName: string;
      middleName: string;
      employeeId: string;
      terminationId: number;
    }
  ];
  meta: {
    total: number;
  };
  rels: [];
}
