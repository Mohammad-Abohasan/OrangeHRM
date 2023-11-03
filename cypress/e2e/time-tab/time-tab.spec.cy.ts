import SharedHelper from "../../support/helpers/shared-helper";
import AdminHelper from "../../support/helpers/admin-tab/admin-helper";
import PimHelper from "../../support/helpers/pim-tab/pim-helper";
import TimesheetsPageActions from "../../support/page-objects/time-tab/timesheets-page/timesheets-page-actions";
import TimesheetsPageAssertions from "../../support/page-objects/time-tab/timesheets-page/timesheets-page-assertions";

let employeeData: any = {};
let adminData: any = {};
const timesheetsPageActions: TimesheetsPageActions =
  new TimesheetsPageActions();
const timesheetsPageAssertions: TimesheetsPageAssertions =
  new TimesheetsPageAssertions();

describe("Time: ", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();
    cy.fixture("pim-tab/employeeInfo.json").then(
      (employeeInfo) => (employeeData = employeeInfo)
    );
    cy.fixture("admin-tab/user-management-page/adminInfo.json").then(
      (adminInfo) => (adminData = adminInfo)
    );
  });

  it("Time - Timesheets: The user should be able to add a new timesheet", () => {
    PimHelper.addEmployee(employeeData)
      .then((employeeResponse) =>
        AdminHelper.addAdmin(adminData, employeeResponse.empNumber)
      )
      .then(() => {
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM(adminData.username, adminData.password);
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
