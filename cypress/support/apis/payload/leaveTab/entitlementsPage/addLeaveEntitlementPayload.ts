export interface IAddLeaveEntitlementPayload {
  empNumber: number;
  leaveTypeId: number;
  fromDate: string;
  toDate: string;
  entitlement: string;
}
