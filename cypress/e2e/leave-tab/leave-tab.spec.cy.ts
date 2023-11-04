import moment from "moment";
import LeaveHelper from "../../support/helpers/leave-tab/leave-helper";
import PimHelper from "../../support/helpers/pim-tab/pim-helper";
import AdminHelper from "../../support/helpers/admin-tab/admin-helper";
import MyLeavePageActions from "../../support/page-objects/leave-tab/my-leave-page/my-leave-page-actions";
import MyLeavePageAssertions from "../../support/page-objects/leave-tab/my-leave-page/my-leave-page-assertions";

const myLeavePageActions: MyLeavePageActions = new MyLeavePageActions();
const myLeavePageAssertions: MyLeavePageAssertions =
  new MyLeavePageAssertions();
let employeeData: any = {};
let employeeLoginData: any = {};
describe("Leave: Leave's functionality", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();
    cy.fixture("pim-tab/employeeInfo.json").then(
      (empData: any) => (employeeData = empData)
    );
    cy.fixture("admin-tab/user-management-page/adminInfo.json").then(
      (adminInfo) => (employeeLoginData = adminInfo)
    );
  });

  it("Leave - My Leave: Employee Applies for Leave, Admin Approves, and Employee Checks Leave Status", () => {
    PimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Add Login Details for the employee.
      .then((employeeResponse) => {
        employeeData.empNumber = employeeResponse.empNumber;
        employeeData.firstName = employeeResponse.firstName;
        return AdminHelper.addAdmin(
          employeeLoginData,
          employeeResponse.empNumber
        );
      })
      // Add leave entitlement for the employee.
      .then((adminEmployeeResponse) => {
        employeeLoginData.username = adminEmployeeResponse.userName;
        return cy
          .fixture("leave-tab/entitlements-page/leaveEntitlementInfo.json")
          .then((leaveEntitlementData) => {
            leaveEntitlementData.fromDate = moment().format("YYYY-01-01");
            leaveEntitlementData.toDate = moment().format("YYYY-12-31");
            return LeaveHelper.addLeaveEntitlement(
              leaveEntitlementData,
              employeeData.empNumber
            );
          });
      })
      // Login as employee and apply for leave.
      .then((leaveEntitlementResponse) => {
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM(
          employeeLoginData.username,
          employeeLoginData.password
        );
        return cy
          .fixture("leave-tab/apply-page/leaveRequestInfo.json")
          .then((leaveRequestData) => {
            leaveRequestData.fromDate = moment()
              .add(1, "day")
              .add(moment().day() % 6 === 0 ? 1 : 0, "day")
              .format("YYYY-MM-DD");
            leaveRequestData.toDate = moment()
              .add(1, "day")
              .add(moment().day() % 6 === 0 ? 1 : 0, "day")
              .format("YYYY-MM-DD");
            return LeaveHelper.applyLeave(
              leaveRequestData,
              leaveEntitlementResponse.leaveType.id
            );
          });
      })
      // Login as admin and approve the leave.
      .then((leaveRequestResponse) => {
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM();
        cy.fixture(
          "leave-tab/leave-list-page/actionOnLeaveRequestInfo.json"
        ).then((actionOnLeaveRequestData) => {
          LeaveHelper.actionOnLeaveRequest(
            actionOnLeaveRequestData,
            leaveRequestResponse.id
          );
        });
      })
      // Login as employee and check the leave status.
      .then(() => {
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM(
          employeeLoginData.username,
          employeeLoginData.password
        );
        myLeavePageActions.openMyLeavePage();
        cy.fixture("leave-tab/my-leave-page/myLeaveInfo.json").then(
          (myLeaveData) => {
            myLeaveData.Date = moment()
              .add(1, "day")
              .add(moment().day() % 6 === 0 ? 1 : 0, "day")
              .format("YYYY-MM-DD");
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
        PimHelper.deleteEmployee(employeeData.empNumber);
      });
  });
});
