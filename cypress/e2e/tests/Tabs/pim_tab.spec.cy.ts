import LoginPage from "../../../support/pageObjects/LoginPage";
import PIMTab from "../../../support/pageObjects/PIMTab/PIMTab";
import DataUtils from "../../../support/DataUtils";

const loginPage: LoginPage = new LoginPage();
const pimTab: PIMTab = new PIMTab();
const dataUtils: DataUtils = new DataUtils();
describe('PIM: Employee\'s table data validation', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.fixture('employeeInfoPIM').as('empInfo');
    cy.fixture('loginInfo').then((loginData: any) => {
      loginPage.login(loginData.userName.valid, loginData.password.valid);
    });

    pimTab.openPIMTab();
  });

  it('PIM - Add employee with Personal Details UI', () => {
    cy.get('@empInfo').then((infoData: any) => {
      pimTab.addEmployee(infoData.firstName, infoData.middleName, infoData.lastName, infoData.id, infoData.userName, infoData.password, infoData.password);

      pimTab.editPersonalDetails(infoData.id, infoData.nickName, infoData.driversLicenseNumber, infoData.licenseExpiryDate, infoData.maritalStatus, infoData.dateOfBirth, infoData.gender);
    });
  });

  it('PIM - Add employee API then edit Personal Details UI', () => {
    cy.get('@empInfo').then((infoData: any) => {
      dataUtils.pimTab.addEmployee(infoData.firstName, infoData.middleName, infoData.lastName, infoData.id, infoData.userName, infoData.password);
      pimTab.editPersonalDetails(infoData.id, infoData.nickName, infoData.driversLicenseNumber, infoData.licenseExpiryDate, infoData.maritalStatus, infoData.dateOfBirth, infoData.gender);
    });
  });

  // ===================================
  // it('Search by key-value', () => {
  //   pimTab.searchEmployee([
  //     { key: "empName", value: "Aaliyah  Haq" }, 
  //     { key: "empId", value: "0038" },
  //     { key: "empStatus", value: "Full-Time Permanent" },
  //     { key: "empInclude", value: "Current and Past Employees" },
  //     { key: "empSupervisorName", value: "Odis Adalwin" },
  //     { key: "empJobTitle", value: "QA Lead" },
  //     { key: "empSubUnit", value: "Quality Assurance" },
  //   ]);
  // });
  // ===================================

  afterEach(() => {
    cy.get('@empInfo').then((infoData: any) => {
      pimTab.deleteEmployee(infoData.id);
    });
  });

});