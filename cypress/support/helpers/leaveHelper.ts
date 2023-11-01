import LeaveInit from "../initializers/leaveInit";
import { IAddLeaveEntitlementPayload } from "../API/payload/Leave/addLeaveEntitlementPayload";
import { IApplyLeavePayload } from "../API/payload/Leave/applyLeavePayload";
import { IActionOnLeaveRequestPayload } from "../API/payload/Leave/actionOnLeaveRequestPayload";

export const URLs = {
  leaveBaseUrl: "/web/index.php/api/v2/leave",
  leaveEntitlements: "/leave-entitlements",
  applyRequest: "/leave-requests",
  actionRequest: "/employees/leave-requests",
};

export default class Leave {
  static addLeaveEntitlement(
    leaveEntitlementData: IAddLeaveEntitlementPayload,
    empNumber: number
  ) {
    cy.addLeaveEntitlement(
      "POST",
      `${URLs.leaveBaseUrl}${URLs.leaveEntitlements}`,
      LeaveInit.initLeaveEntitlement(leaveEntitlementData, empNumber)
    );
  }

  static applyLeave(leaveRequestData: IApplyLeavePayload, leaveTypeId: number) {
    cy.applyLeave(
      "POST",
      `${URLs.leaveBaseUrl}${URLs.applyRequest}`,
      LeaveInit.initLeaveRequest(leaveRequestData, leaveTypeId)
    );
  }

  static actionOnLeaveRequest(
    action: IActionOnLeaveRequestPayload,
    leaveRequestId: number
  ) {
    cy.actionOnLeaveRequest(
      "PUT",
      `${URLs.leaveBaseUrl}${URLs.actionRequest}/${leaveRequestId}`,
      LeaveInit.initActionOnLeaveRequest(action)
    );
  }
}
