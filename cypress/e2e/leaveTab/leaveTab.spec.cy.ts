import moment from "moment";
import leaveHelper from "../../support/helpers/leaveTab/LeaveHelper";
import pimHelper from "../../support/helpers/pimTab/PimHelper";
import adminHelper from "../../support/helpers/adminTab/AdminHelper";
import MyLeavePageActions from "../../support/pageObjects/leaveTab/myLeavePage/MyLeavePageActions";
import MyLeavePageAssertions from "../../support/pageObjects/leaveTab/myLeavePage/MyLeavePageAssertions";

const myLeavePageActions: MyLeavePageActions = new MyLeavePageActions();
const myLeavePageAssertions: MyLeavePageAssertions =
  new MyLeavePageAssertions();
let employeeData: any = {};
describe("Leave: Leave's functionality", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();
    cy.fixture("pimTab/employeeInfo.json").then(
      (empData: any) => (employeeData = empData)
    );
  });

  it("Leave - My Leave: Employee Applies for Leave, Admin Approves, and Employee Checks Leave Status", () => {
    pimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Add Login Details for the employee.
      .then((employeeResponse) => {
        employeeData.empNumber = employeeResponse.empNumber;
        cy.fixture("adminTab/userManagementPage/adminInfo.json").then(
          (adminData) => {
            adminHelper.addAdmin(adminData, employeeResponse.empNumber);
          }
        );
      })
      // Add leave entitlement for the employee.
      .then(() => {
        return cy
          .fixture("leaveTab/entitlementsPage/leaveEntitlementInfo.json")
          .then((leaveEntitlementData) => {
            leaveEntitlementData.fromDate = moment().format("YYYY-01-01");
            leaveEntitlementData.toDate = moment().format("YYYY-12-31");
            return leaveHelper.addLeaveEntitlement(
              leaveEntitlementData,
              employeeData.empNumber
            );
          });
      })
      // Login as employee and apply for leave.
      .then((leaveEntitlementResponse) => {
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM(employeeData.userName, employeeData.password);
        return cy
          .fixture("leaveTab/applyPage/leaveRequestInfo.json")
          .then((leaveRequestData) => {
            leaveRequestData.fromDate = moment()
              .add(1, "day")
              .format("YYYY-MM-DD");
            leaveRequestData.toDate = moment()
              .add(1, "day")
              .format("YYYY-MM-DD");
            return leaveHelper.applyLeave(
              leaveRequestData,
              leaveEntitlementResponse.leaveType.id
            );
          });
      })
      // Login as admin and approve the leave.
      .then((leaveRequestResponse) => {
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM();
        cy.fixture("leaveTab/leaveListPage/actionOnLeaveRequestInfo.json").then(
          (actionOnLeaveRequestData) => {
            leaveHelper.actionOnLeaveRequest(
              actionOnLeaveRequestData,
              leaveRequestResponse.id
            );
          }
        );
      })
      // Login as employee and check the leave status.
      .then(() => {
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM(employeeData.userName, employeeData.password);
        myLeavePageActions.openMyLeavePage();
        cy.fixture("leaveTab/myLeavePage/myLeaveInfo.json").then(
          (myLeaveData) => {
            myLeaveData.Date = moment().add(1, "day").format("YYYY-MM-DD");
            myLeaveData["Leave Balance (Days)"] -=
              myLeaveData["Number of Days"];
            myLeavePageActions.searchForLeave(myLeaveData);
            myLeavePageAssertions.checkRecordsContainsLeave(myLeaveData);
          }
        );
      })
      // Login as admin and delete the employee.
      .then(() => {
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM();
        pimHelper.deleteEmployee(employeeData.empNumber);
      });
  });
});
