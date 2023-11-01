import { IActionOnLeaveRequestPayload } from "../../apis/payload/leaveTab/leaveListPage/actionOnLeaveRequestPayload";
import { IAddLeaveEntitlementPayload } from "../../apis/payload/leaveTab/entitlementsPage/addLeaveEntitlementPayload";
import { IApplyLeavePayload } from "../../apis/payload/leaveTab/applyPage/applyLeavePayload";

export default class LeaveInit {
  static initLeaveEntitlement(
    leaveEntitlementData: IAddLeaveEntitlementPayload,
    empNumber: number
  ): IAddLeaveEntitlementPayload {
    const payload = {
      ...leaveEntitlementData,
      empNumber,
    };
    return payload;
  }

  static initLeaveRequest(
    leaveRequestData: IApplyLeavePayload,
    leaveTypeId: number
  ): IApplyLeavePayload {
    const payload = {
      ...leaveRequestData,
      leaveTypeId,
    };
    return payload;
  }

  static initActionOnLeaveRequest(
    actionData: IActionOnLeaveRequestPayload
  ): IActionOnLeaveRequestPayload {
    const payload = {
      ...actionData,
    };
    return payload;
  }
}
