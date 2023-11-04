export interface IAddLeaveEntitlementResponse {
  data: {
    id: number;
    employee: {
      empNumber: number;
      lastName: string;
      firstName: string;
      middleName: string;
      employeeId: string;
      terminationId: number;
    };
    entitlement: number;
    daysUsed: number;
    leaveType: {
      id: number;
      name: string;
      deleted: boolean;
    };
    fromDate: string;
    toDate: string;
    creditedDate: string;
    entitlementType: {
      id: 1;
      name: string;
    };
    deleted: boolean;
    deletable: boolean;
  };
  meta: [];
  rels: [];
}
