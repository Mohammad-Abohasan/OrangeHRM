export interface IApplyLeaveResponse {
  data: {
    id: number;
    leaveType: {
      id: number;
      name: string;
      deleted: boolean;
    };
    dateApplied: string;
  };
  meta: {
    empNumber: number;
  };
  rels: [];
}
