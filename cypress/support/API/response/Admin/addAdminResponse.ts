export interface ICreateAdminResponse {
  data: {
    id: number;
    userName: string;
    deleted: boolean;
    status: boolean;
    employee: {
      empNumber: number;
      employeeId: string;
      firstName: string;
      middleName: string;
      lastName: string;
      terminationId: number;
    };
    userRole: {
      id: number;
      name: string;
      displayName: string;
    };
  };
  meta: [];
  rels: [];
}
