import SharedHelper from "../../support/helpers/SharedHelper";
import AdminHelper from "../../support/helpers/adminTab/AdminHelper";
import PimHelper from "../../support/helpers/pimTab/PimHelper";
import TimesheetsPageActions from "../../support/pageObjects/timeTab/timesheetsPage/TimesheetsPageActions";
import TimesheetsPageAssertions from "../../support/pageObjects/timeTab/timesheetsPage/TimesheetsPageAssertions";

let employeeData: any = {};
let adminData: any = {};
const timesheetsPageActions: TimesheetsPageActions =
  new TimesheetsPageActions();
const timesheetsPageAssertions: TimesheetsPageAssertions =
  new TimesheetsPageAssertions();

describe("Time: ", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();
    cy.fixture("pimTab/employeeInfo.json").then(
      (employeeInfo) => (employeeData = employeeInfo)
    );
    cy.fixture("adminTab/userManagementPage/adminInfo.json").then(
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
