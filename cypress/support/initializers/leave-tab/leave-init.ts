import { IActionOnLeaveRequestPayload } from "../../apis/payload/leave-tab/leave-list-page/action-on-leave-request-payload";
import { IAddLeaveEntitlementPayload } from "../../apis/payload/leave-tab/entitlements-page/add-leave-entitlement-payload";
import { IApplyLeavePayload } from "../../apis/payload/leave-tab/apply-page/apply-leave-payload";

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
