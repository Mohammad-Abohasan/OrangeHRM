import { IActionOnLeaveRequestPayload } from "../API/payload/Leave/actionOnLeaveRequestPayload";
import { IAddLeaveEntitlementPayload } from "../API/payload/Leave/addLeaveEntitlementPayload";
import { IApplyLeavePayload } from "../API/payload/Leave/applyLeavePayload";

export default class Leave {
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
