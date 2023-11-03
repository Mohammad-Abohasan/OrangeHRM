import SharedHelper from "../../../helpers/shared-helper";

class MyLeavePageAssertions {
  elements = {};

  checkRecordsContainsLeave(leaveData: any) {
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Date",
      leaveData["Date"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Employee Name",
      leaveData["Employee Name"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Leave Type",
      leaveData["Leave Type"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Leave Balance (Days)",
      leaveData["Leave Balance (Days)"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Number of Days",
      leaveData["Number of Days"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Status",
      leaveData["Status"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Comments",
      leaveData["Comments"]
    );
  }
}

export default MyLeavePageAssertions;
