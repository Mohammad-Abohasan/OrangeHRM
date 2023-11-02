import SharedHelper from "../../helpers/SharedHelper";

class PimTabAssertions {
  elements = {};

  checkRecordsContainsEmployee(employeeData: any) {
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Id",
      employeeData.employeeId
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "First (& Middle) Name",
      `${employeeData.firstName} ${employeeData.middleName}`
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Last Name",
      employeeData.lastName
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Job Title",
      employeeData.jobTitle
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Employment Status",
      employeeData.employmentStatus
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Sub Unit",
      employeeData.subUnit
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Supervisor",
      employeeData.supervisor
    );
  }
}

export default PimTabAssertions;
