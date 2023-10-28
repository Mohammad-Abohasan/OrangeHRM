import AdminHelper from "../../support/helpers/adminTab/AdminHelper";
import PimHelper from "../../support/helpers/pimTab/PimHelper";
import Timesheets from "../../support/pageObjects/timeTab/TimesheetsPage";

let employeeData: any = {};
let adminData: any = {};
const timesheetsPage: Timesheets = new Timesheets();

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
        AdminHelper.addAdmin(adminData, employeeResponse.data.empNumber)
      )
      .then(() => {
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM(adminData.username, adminData.password);
        timesheetsPage.openTimePage();
        timesheetsPage.openMyTimesheets();
        timesheetsPage.addTimesheet();
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM();
        timesheetsPage.openTimePage();
        timesheetsPage.openEmployeeTimesheets();
        timesheetsPage.timesheetTableContains(employeeData);
      });
  });

  afterEach(() => {
    PimHelper.getEmployee(employeeData.employeeId).then((employeeResponse) => {
      PimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
    });
  });
});
