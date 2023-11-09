import SharedInit from "../../initializers/shared-init";
import ClaimInit from "../../initializers/claim-tab/claim-init";

export const URLs = {
  claimBaseUrl: "/web/index.php/api/v2/claim",
  events: "/events",
  claimRequests: "/requests",
  action: "/action",
};
export default class ClaimHelper {
  static addEvent(eventData: any): any {
    return cy
      .addEvent(
        "POST",
        `${URLs.claimBaseUrl}${URLs.events}`,
        ClaimInit.initAddEvent(eventData)
      )
      .then((response: any) => response.data);
  }

  static addClaimRequest(claimReqData: any, eventId: any): any {
    return cy
      .addClaimRequest(
        "POST",
        `${URLs.claimBaseUrl}${URLs.claimRequests}`,
        ClaimInit.initAddClaimRequest(claimReqData, eventId)
      )
      .then((response: any) => response.data);
  }

  static deleteEvent(eventId: any): any {
    cy.deleteItem(
      "DELETE",
      `${URLs.claimBaseUrl}${URLs.events}`,
      SharedInit.initDeleteItem(eventId)
    );
  }

  static actionOnClaimRequest(claimReqId: any, action: any): any {
    return cy.actionOnClaimRequest(
      "PUT",
      `${URLs.claimBaseUrl}${URLs.claimRequests}/${claimReqId}${URLs.action}`,
      ClaimInit.initActionOnClaimRequest({ action })
    );
  }

  static submitClaimRequest(claimReqId: any): any {
    return this.actionOnClaimRequest(claimReqId, "SUBMIT");
  }

  static approveClaimRequest(claimReqId: any): any {
    return this.actionOnClaimRequest(claimReqId, "APPROVE");
  }

  static rejectClaimRequest(claimReqId: any): any {
    return this.actionOnClaimRequest(claimReqId, "REJECT");
  }

  static cancelClaimRequest(claimReqId: any): any {
    return this.actionOnClaimRequest(claimReqId, "CANCEL");
  }
}
