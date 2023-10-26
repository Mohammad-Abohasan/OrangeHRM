import leaveHelper from "../../../support/helpers/leaveHelper";
import pimHelper from "../../../support/helpers/pimHelper";
import adminHelper from "../../../support/helpers/adminHelper";
import sharedHelper from "../../../support/helpers/sharedHelper";
import MyLeavePage from "../../../support/pageObjects/LeaveTab/MyLeavePage";

const myLeavePage: MyLeavePage = new MyLeavePage();
let loginData: any = {};
let employeeData: any = {};
describe("Leave: ", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.fixture("loginInfo").then((logData: any) => {
      loginData = logData;
      cy.loginOrangeHRM(logData.userName.valid, logData.password.valid);
    });
    cy.fixture("employeeInfo").then((empData: any) => (employeeData = empData));
  });

  it("Leave - My Leave: Employee Applies for Leave, Admin Approves, and Employee Checks Leave Status", () => {
    pimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Add Login Details for the employee.
      .then((employeeResponse) => {
        employeeData.empNumber = employeeResponse.data.empNumber;
        cy.fixture("adminInfo").then((adminData) => {
          adminHelper.addAdmin(adminData, employeeResponse.data.empNumber);
        });
      })
      // Add leave entitlement for the employee.
      .then(() => {
        return cy
          .fixture("leaveEntitlementInfo")
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
        return cy.fixture("leaveRequestInfo").then((leaveRequestData) => {
          return leaveHelper.applyLeave(
            leaveRequestData,
            leaveEntitlementResponse.data.leaveType.id
          );
        });
      })
      // Login as admin and approve the leave.
      .then((leaveRequestResponse) => {
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM(loginData.userName.valid, loginData.password.valid);
        cy.fixture("actionOnLeaveRequestInfo").then(
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
        cy.fixture("myLeaveTableInfo").then((myLeaveTableData) => {
          sharedHelper.checkRows(".oxd-table-row", myLeaveTableData);
        });
      })
      // Login as admin and delete the employee.
      .then(() => {
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM(loginData.userName.valid, loginData.password.valid);
        pimHelper.deleteEmployee(employeeData.empNumber);
      });
  });
});
