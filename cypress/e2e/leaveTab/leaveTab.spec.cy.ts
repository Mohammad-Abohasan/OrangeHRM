import leaveHelper from "../../support/helpers/leaveTab/LeaveHelper";
import pimHelper from "../../support/helpers/pimTab/PimHelper";
import adminHelper from "../../support/helpers/adminTab/AdminHelper";
import sharedHelper from "../../support/helpers/SharedHelper";
import MyLeavePage from "../../support/pageObjects/leaveTab/myLeavePage/MyLeavePage";

const myLeavePage: MyLeavePage = new MyLeavePage();
let employeeData: any = {};
describe("Leave: Leave's table data validation", () => {
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
        employeeData.empNumber = employeeResponse.data.empNumber;
        cy.fixture("adminTab/userManagementPage/adminInfo.json").then(
          (adminData) => {
            adminHelper.addAdmin(adminData, employeeResponse.data.empNumber);
          }
        );
      })
      // Add leave entitlement for the employee.
      .then(() => {
        return cy
          .fixture("leaveTab/entitlementsPage/leaveEntitlementInfo.json")
          .then((leaveEntitlementData) => {
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
            return leaveHelper.applyLeave(
              leaveRequestData,
              leaveEntitlementResponse.data.leaveType.id
            );
          });
      })
      // Login as admin and approve the leave.
      .then((leaveRequestResponse) => {
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM();
        cy.fixture("leaveTab/myLeavePage/actionOnLeaveRequestInfo.json").then(
          (actionOnLeaveRequestData) => {
            leaveHelper.actionOnLeaveRequest(
              actionOnLeaveRequestData,
              leaveRequestResponse.data.id
            );
          }
        );
      })
      // Login as employee and check the leave status.
      .then(() => {
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM(employeeData.userName, employeeData.password);
        myLeavePage.open();
        cy.fixture("leaveTab/leaveListPage/myLeaveInfo.json").then(
          (myLeaveData) => {
            myLeaveData[0]["Leave Balance (Days)"] -=
              myLeaveData[0]["Number of Days"];
            sharedHelper.checkRows(".oxd-table-row", myLeaveData);
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
