import SharedHelper from "../../helpers/shared-helper";

export default class ClaimTabActions {
  elements = {
    buttonActions: () => cy.getByAttribute("type", "button"),
  };

  openClaimTab() {
    SharedHelper.mainMenuItems().contains("Claim").click();
  }

  openEmployeeClaimsPage() {
    SharedHelper.topBarItems().contains("Employee Claims").click();
  }

  approveClaimRequest() {
    this.elements.buttonActions().contains(" Approve ").click();
  }

  rejectClaimRequest() {
    this.elements.buttonActions().contains(" Reject ").click();
  }

  cancelClaimRequest() {
    this.elements.buttonActions().contains(" Cancel ").click();
  }

  searchClaimRequest(claimReqData: any, isAdmin: boolean = false) {
    if (isAdmin) {
      SharedHelper.fillInInputField(
        "Employee Name",
        `${claimReqData.employeeName.firstName} ${claimReqData.employeeName.middleName} ${claimReqData.employeeName.lastName}`
      );
    }
    SharedHelper.fillInInputField("Reference Id", claimReqData.referenceId);
    SharedHelper.fillInInputField("Event Name", claimReqData.eventName);
    SharedHelper.fillInInputField("Claim - Status", claimReqData.status);
    SharedHelper.fillInInputField("From Date", claimReqData.submittedDate);
    SharedHelper.fillInInputField("To Date", claimReqData.submittedDate);
    SharedHelper.clickSubmitButtonIsContains("Search");
  }

  viewDetailsOfClaimRequest() {
    this.elements.buttonActions().contains(" View Details ").click();
  }
}
