import LoginPage from "../../../pageObjects/LoginPage";
import PIMTab from "../../../pageObjects/PIMTab/PIMTab";

const loginPage: LoginPage = new LoginPage();
const pimTab: PIMTab = new PIMTab();

describe('Login Page', () => {

  beforeEach(() => {
    cy.intercept('/web/index.php/dashboard/index').as('Login');
    cy.visit('/');

    loginPage.login('Admin', 'admin123');
    cy.fixture('employeeInfoPIM').as('empInfo');
    pimTab.openPIMTab();
  });

  it('Add employee', () => {
    cy.get('@empInfo').then((infoData: any) => {
      pimTab.addNewEmployee(infoData.firstName, infoData.middleName, infoData.lastName, infoData.id, infoData.userName, infoData.password, infoData.password);

      pimTab.editPersonalDetails(infoData.nickName, infoData.driversLicenseNumber, infoData.licenseExpiryDate, infoData.maritalStatus, infoData.dateOfBirth, infoData.gender);
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
    })
  });

});
