import LeaveInit from "../../initializers/leaveTab/leaveInit";
import { IAddLeaveEntitlementPayload } from "../../apis/payload/leaveTab/entitlementsPage/addLeaveEntitlementPayload";
import { IApplyLeavePayload } from "../../apis/payload/leaveTab/applyPage/applyLeavePayload";
import { IActionOnLeaveRequestPayload } from "../../apis/payload/leaveTab/leaveListPage/actionOnLeaveRequestPayload";

export const URLs = {
  leaveBaseUrl: "/web/index.php/api/v2/leave",
  leaveEntitlements: "/leave-entitlements",
  applyRequest: "/leave-requests",
  actionRequest: "/employees/leave-requests",
};

export default class LeaveHelper {
  static addLeaveEntitlement(
    leaveEntitlementData: IAddLeaveEntitlementPayload,
    empNumber: number
  ) {
    cy.addLeaveEntitlement(
      "POST",
      `${URLs.leaveBaseUrl}${URLs.leaveEntitlements}`,
      LeaveInit.initLeaveEntitlement(leaveEntitlementData, empNumber)
    ).then((response) => response.data);
  }

  static applyLeave(leaveRequestData: IApplyLeavePayload, leaveTypeId: number) {
    cy.applyLeave(
      "POST",
      `${URLs.leaveBaseUrl}${URLs.applyRequest}`,
      LeaveInit.initLeaveRequest(leaveRequestData, leaveTypeId)
    ).then((response) => response.data);
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
