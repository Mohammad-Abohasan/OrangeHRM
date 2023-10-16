import LoginPage from "../../../support/pageObjects/LoginPage";
import pimHelper from "../../../support/helpers/pimHelper";
import adminHelper from "../../../support/helpers/adminHelper";

const loginPage: LoginPage = new LoginPage();

let employeeData: any = {};

describe("Login Page", () => {
  beforeEach(() => {
    cy.intercept("/web/index.php/dashboard/index").as("Login");
    cy.visit("/");

    loginPage.login("Admin", "admin123");

    cy.fixture("employeeInfo").then((empData) => {
      employeeData = empData;
    });
  });

  it("Verify Admin - add employee response", () => {
    pimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Add an Admin
      .then((employeeResponse) => {
        cy.fixture("adminInfo").then((adminData) => {
          adminHelper.addAdmin(adminData, employeeResponse.data.empNumber);
        });
      })
      // Delete the employee after the test
      .then(() => {
        return pimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        pimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
      });
  });
});
