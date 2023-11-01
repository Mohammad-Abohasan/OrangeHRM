import PIMTab from "../../support/pageObjects/pimTab/PimTab";
import pimHelper from "../../support/helpers/pimTab/PimHelper";
import adminHelper from "../../support/helpers/adminTab/AdminHelper";

const pimTab: PIMTab = new PIMTab();

let employeeData: any = {};

describe("PIM: Employee's table data validation", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();
    cy.fixture("pimTab/employeeInfo.json").then((empData) => {
      employeeData = empData;
    });
    pimTab.openPIMTab();
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
        cy.loginOrangeHRM(employeeData.userName, employeeData.password);

        // Login as Admin
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM();
      });
  });

  it("PIM - Add employee with Personal Details UI", /*{ retries: 2 },*/ () => {
    pimTab.addEmployee(
      employeeData.firstName,
      employeeData.middleName,
      employeeData.lastName,
      employeeData.employeeId,
      employeeData.userName,
      employeeData.password,
      employeeData.password
    );
    pimTab.editPersonalDetails(
      employeeData.employeeId,
      employeeData.nickName,
      employeeData.driversLicenseNumber,
      employeeData.licenseExpiryDate,
      employeeData.maritalStatus,
      employeeData.dateOfBirth,
      employeeData.gender
    );

    pimTab.openPIMTab();
    let pimTableData = [
      {
        Id: employeeData.employeeId,
        "First (& Middle) Name": `${employeeData.firstName} ${employeeData.middleName}`,
        "Last Name": employeeData.lastName,
        "Job Title": employeeData.jobTitle,
        "Employment Status": employeeData.employmentStatus,
        "Sub Unit": employeeData.subUnit,
        Supervisor: employeeData.supervisor,
      },
    ];
    // sharedHelper.checkRows(".oxd-table-row", pimTableData);
  });

  it("PIM - Add employee API then edit Personal Details UI", () => {
    pimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Edit Personal Details
      .then(() => {
        pimTab.editPersonalDetails(
          employeeData.employeeId,
          employeeData.nickName,
          employeeData.driversLicenseNumber,
          employeeData.licenseExpiryDate,
          employeeData.maritalStatus,
          employeeData.dateOfBirth,
          employeeData.gender
        );
      });
  });

  it("PIM - Search by employee id and check info", () => {
    pimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Search an employee
      .then(() => {
        pimTab.searchEmployee([
          employeeData.employeeId,
          employeeData.firstName,
          employeeData.middleName,
          employeeData.lastName,
          employeeData.jobTitle,
          employeeData.employmentStatus,
          employeeData.subUnit,
          employeeData.supervisor,
        ]);
      });
  });

  afterEach(() => {
    // Delete the employee after the test
    pimHelper.getEmployee(employeeData.employeeId).then((employeeResponse) => {
      pimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
    });
  });
});
