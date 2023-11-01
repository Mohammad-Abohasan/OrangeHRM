import SharedHelper from "../../../helpers/SharedHelper";

class TimesheetsPageAssertions {
  elements = {};

  addTimesheetAssertion() {
    SharedHelper.checkToastMessage("Timesheet Submitted");
  }

  checkRecordsContainsTimesheetAssertion(employeeData: any) {
    SharedHelper.checkRecordsContainsValueInColumn(0, "Action", "Submitted");
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Performed By",
      `${employeeData.firstName} ${employeeData.lastName}`
    );
  }
}

export default TimesheetsPageAssertions;
