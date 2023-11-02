import SharedHelper from "../../../helpers/SharedHelper";

class TimesheetsPageAssertions {
  elements = {};
  
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
