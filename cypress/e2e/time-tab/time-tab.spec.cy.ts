import SharedHelper from "../../support/helpers/shared-helper";
import AdminHelper from "../../support/helpers/admin-tab/admin-helper";
import PimHelper from "../../support/helpers/pim-tab/pim-helper";
import TimesheetsPageActions from "../../support/page-objects/time-tab/timesheets-page/timesheets-page-actions";
import TimesheetsPageAssertions from "../../support/page-objects/time-tab/timesheets-page/timesheets-page-assertions";

let employeeData: any = {};
let employeeLoginData: any = {};
const timesheetsPageActions: TimesheetsPageActions =
  new TimesheetsPageActions();
const timesheetsPageAssertions: TimesheetsPageAssertions =
  new TimesheetsPageAssertions();

describe("Time: Time Tab Functionality", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();
    cy.fixture("pim-tab/employeeInfo.json").then(
      (employeeInfo) => (employeeData = employeeInfo)
    );
    cy.fixture("admin-tab/user-management-page/adminInfo.json").then(
      (adminInfo) => (employeeLoginData = adminInfo)
    );
  });

  it("Time - Timesheets: The user should be able to add a new timesheet", () => {
    PimHelper.addEmployee(employeeData)
      .then((employeeResponse) => {
        employeeData.firstName = employeeResponse.firstName;
        return AdminHelper.addAdmin(
          employeeLoginData,
          employeeResponse.empNumber
        );
      })
      .then((adminEmployeeResponse) => {
        employeeLoginData.username = adminEmployeeResponse.userName;
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM(
          employeeLoginData.username,
          employeeLoginData.password
        );
        timesheetsPageActions.openTimePage();
        timesheetsPageActions.openMyTimesheets();
        timesheetsPageActions.addTimesheet();
        SharedHelper.checkToastMessage("Timesheet Submitted");
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM();
        timesheetsPageActions.openTimePage();
        timesheetsPageActions.openEmployeeTimesheets();
        timesheetsPageActions.checkRecordsContainsTimesheet(employeeData);
        timesheetsPageAssertions.checkRecordsContainsTimesheetAssertion(
          employeeData
        );
      });
  });

  afterEach(() => {
    PimHelper.getEmployee(employeeData.employeeId).then((employeeResponse) => {
      PimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
    });
  });
});
