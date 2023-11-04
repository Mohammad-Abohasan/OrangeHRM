import SharedHelper from "../../../helpers/shared-helper";

class MyLeavePageActions {
  elements = {};

  openMyLeavePage() {
    cy.intercept("/web/index.php/api/v2/leave/leave-requests**").as(
      "leaveRequests"
    );
    cy.intercept("/web/index.php/api/v2/leave/leave-periods**").as(
      "leavePeriods"
    );
    cy.intercept("/web/index.php/api/v2/leave/leave-types/eligible**").as(
      "leaveTypes"
    );
    cy.intercept("/web/index.php/api/v2/leave/workweek**").as("workweek");
    cy.intercept("/web/index.php/api/v2/leave/holidays**").as("holidays");

    cy.visit("/web/index.php/leave/viewMyLeaveList");

    cy.wait([
      "@leaveRequests",
      "@leavePeriods",
      "@leaveTypes",
      "@workweek",
      "@holidays",
    ]);
  }

  searchForLeave(leaveData: any) {
    SharedHelper.fillInInputField("From Date", leaveData.Date);
    SharedHelper.fillInInputField("To Date", leaveData.Date);
    SharedHelper.deselectOptionsFromMultiSelect("Show Leave with Status");
    SharedHelper.fillInInputField(
      "Show Leave with Status",
      leaveData.Status.split(" ")[0]
    );
    SharedHelper.fillInInputField("Leave Type", leaveData["Leave Type"]);
  }
}

export default MyLeavePageActions;
