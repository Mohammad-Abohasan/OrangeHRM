import LoginPage from "../../../support/pageObjects/LoginPage";
import PIMTab from "../../../support/pageObjects/PIMTab";
import pimHelper from "../../../support/helpers/pimHelper";
import commonHelper from "../../../support/helpers/commonHelper";

const loginPage: LoginPage = new LoginPage();
const pimTab: PIMTab = new PIMTab();

let employeeData: any = {};

describe("PIM: Employee's table data validation", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.fixture("loginInfo").then((loginData: any) => {
      loginPage.login(loginData.userName.valid, loginData.password.valid);
    });

    cy.fixture("employeeInfo").then((empData) => {
      employeeData = empData;
    });

    pimTab.openPIMTab();
  });

  it.only("PIM - Add employee with Personal Details UI", /*{ retries: 2 },*/ () => {
    commonHelper.deleteAllRecords(
      ".oxd-checkbox-input-icon",
      ".oxd-button--label-danger",
      ".oxd-button--label-danger"
    );

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
    commonHelper.checkRows(".oxd-table-row", pimTableData);
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
