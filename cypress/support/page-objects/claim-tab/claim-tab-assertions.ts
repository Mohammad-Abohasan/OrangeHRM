import SharedHelper from "../../helpers/shared-helper";

export default class ClaimTabAssertions {
  elements = {};

  verifyClaimRequestDetails(claimReqData: any, isAdmin: boolean = false) {
    if (isAdmin) {
      SharedHelper.checkRecordsContainsValueInColumn(
        0,
        "Employee Name",
        `${claimReqData.employeeName.firstName} ${claimReqData.employeeName.lastName}`
      );
    }
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Reference Id",
      claimReqData.referenceId
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Event Name",
      claimReqData.eventName
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Description",
      claimReqData.description
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Currency",
      claimReqData.currency
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Submitted Date",
      claimReqData.submittedDate
    );
    SharedHelper.checkRecordsContainsValueInColumn(0, "Status", claimReqData.status);
    SharedHelper.checkRecordsContainsValueInColumn(0, "Amount", claimReqData.amount);
  }
}
