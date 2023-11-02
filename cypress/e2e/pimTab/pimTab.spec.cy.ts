import PimTabActions from "../../support/pageObjects/pimTab/PimTabActions";
import PimTabAssertions from "../../support/pageObjects/pimTab/PimTabAssertions";
import pimHelper from "../../support/helpers/pimTab/PimHelper";
import adminHelper from "../../support/helpers/adminTab/AdminHelper";
import SharedHelper from "../../support/helpers/SharedHelper";

const pimTabActions: PimTabActions = new PimTabActions();
const pimTabAssertions: PimTabAssertions = new PimTabAssertions();

let employeeData: any = {};

describe("PIM: Employee's table data validation", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();
    cy.fixture("pimTab/employeeInfo.json").then((empData) => {
      employeeData = empData;
    });
    pimTabActions.openPimTab();
  });

  it("PIM - Add employee and verify login info", () => {
    pimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Add an Admin
      .then((employeeResponse) => {
        cy.fixture("adminTab/userManagementPage/adminInfo").then(
          (adminData) => {
            adminHelper.addAdmin(adminData, employeeResponse.empNumber);
          }
        );
      })
      // Verify login info
      .then(() => {
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM(employeeData.username, employeeData.password);

        // Login as Admin
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM();
      });
  });

  it("PIM - Add employee with Personal Details UI", () => {
    pimTabActions.addEmployee(employeeData, true);
    SharedHelper.checkToastMessage("Successfully Saved");
    SharedHelper.checkLoadingSpinnerIsExist(false);
    pimTabActions.editPersonalDetails(employeeData);
    SharedHelper.checkToastMessage("Successfully Updated");

    pimTabActions.openPimTab();
    pimTabActions.searchEmployee(employeeData.employeeId);
    pimTabAssertions.checkRecordsContainsEmployee(employeeData);
  });

  it("PIM - Add employee API then edit Personal Details UI", () => {
    pimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Edit Personal Details
      .then((employeeResponse) => {
        pimTabActions.editEmployeeByEmpNumber(employeeResponse.empNumber);
        SharedHelper.checkLoadingSpinnerIsExist(false);
        pimTabActions.editPersonalDetails(employeeData);
        SharedHelper.checkToastMessage("Successfully Updated");
      });
  });

  it("PIM - Search by employee id and check info", () => {
    pimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Search an employee
      .then(() => {
        pimTabActions.searchEmployee(employeeData.employeeId);
        pimTabAssertions.checkRecordsContainsEmployee(employeeData);
      });
  });

  afterEach(() => {
    // Delete the employee after the test
    pimHelper.getEmployee(employeeData.employeeId).then((employeeResponse) => {
      pimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
    });
  });
});
