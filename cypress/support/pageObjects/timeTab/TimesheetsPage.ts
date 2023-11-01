import SharedHelper from "../../helpers/SharedHelper";

class Timesheets {
  elements = {
    timesheetsDropDown: () =>
      cy.get(".oxd-topbar-body-nav-tab").contains("Timesheets"),
    dateInputField: () => cy.get(".oxd-date-input"),
    submitButton: () => cy.getByAttribute("type", "button").contains("Submit"),
    submit: () => cy.getByAttribute("type", "submit"),
    employeeNameSearchField: () =>
      cy.contains(".oxd-input-group", "Employee Name").find("input"),
  };

  openTimePage() {
    SharedHelper.mainMenuItems().contains("Time").click();
  }

  openMyTimesheets() {
    this.elements.timesheetsDropDown().click();
    this.elements
      .timesheetsDropDown()
      .parent()
      .contains("[role='menuitem']", "My Timesheets")
      .click();
  }

  openEmployeeTimesheets() {
    this.elements.timesheetsDropDown().click();
    this.elements
      .timesheetsDropDown()
      .parent()
      .contains("[role='menuitem']", "Employee Timesheets")
      .click();
  }

  addTimesheet() {
    this.elements.submitButton().click();
    SharedHelper.checkToastMessage("Timesheet Submitted");
  }

  timesheetTableContains(employeeData: any) {
    const employeeFullName = `${employeeData.firstName} ${employeeData.middleName} ${employeeData.lastName}`;
    this.elements.employeeNameSearchField().type(employeeFullName);
    SharedHelper.selectOptionFromListBox(employeeFullName);
    this.elements.submit().click();
    SharedHelper.checkRecordsContainsValueInColumn(0, "Action", "Submitted");
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Performed By",
      `${employeeData.firstName} ${employeeData.lastName}`
    );
  }
}

export default Timesheets;
