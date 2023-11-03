import PimTabActions from "../../support/page-objects/pim-tab/pim-tab-actions";
import PimTabAssertions from "../../support/page-objects/pim-tab/pim-tab-assertions";
import PimHelper from "../../support/helpers/pim-tab/pim-helper";
import AdminHelper from "../../support/helpers/admin-tab/admin-helper";
import SharedHelper from "../../support/helpers/shared-helper";

const pimTabActions: PimTabActions = new PimTabActions();
const pimTabAssertions: PimTabAssertions = new PimTabAssertions();

let employeeData: any = {};

describe("PIM: Employee's table data validation", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();
    cy.fixture("pim-tab/employeeInfo.json").then((empData) => {
      employeeData = empData;
    });
    pimTabActions.openPimTab();
  });

  it("PIM - Add employee and verify login info", () => {
    PimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Add an Admin
      .then((employeeResponse) => {
        cy.fixture("admin-tab/user-management-page/adminInfo").then(
          (adminData) => {
            AdminHelper.addAdmin(adminData, employeeResponse.empNumber);
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
    PimHelper
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
    PimHelper
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
    PimHelper.getEmployee(employeeData.employeeId).then((employeeResponse) => {
      PimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
    });
  });
});
