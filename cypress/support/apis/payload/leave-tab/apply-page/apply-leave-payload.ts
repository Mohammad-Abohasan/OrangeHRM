export interface IApplyLeavePayload {
  leaveTypeId: number;
  fromDate: string;
  toDate: string;
  comment: string;
  duration: {
    type: string;
  };
}
