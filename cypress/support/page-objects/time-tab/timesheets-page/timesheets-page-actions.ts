import SharedHelper from "../../../helpers/shared-helper";

class TimesheetsPageActions {
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
  }

  checkRecordsContainsTimesheet(employeeData: any) {
    const employeeFullName = `${employeeData.firstName} ${employeeData.middleName} ${employeeData.lastName}`;
    SharedHelper.selectOptionFromListBox("Employee Name", employeeFullName);
    this.elements.submit().click();
  }
}

export default TimesheetsPageActions;
