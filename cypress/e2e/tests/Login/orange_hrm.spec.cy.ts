import LoginPage from "../../../pageObjects/LoginPage";
import DataUtils from "../../../support/DataUtils";
import PIMTab from "../../../pageObjects/PIMTab";

const loginPage: LoginPage = new LoginPage();
const dataUtils: DataUtils = new DataUtils();
const pimTab: PIMTab = new PIMTab();

describe('Login Page', () => {

  beforeEach(() => {
    cy.intercept('/web/index.php/dashboard/index').as('Login');
    cy.visit('/');

    loginPage.login('Admin', 'admin123');
    cy.fixture('employeeInfoPIM').as('empInfo');
  });

  it('PIM add employee', () => {
    pimTab.openPIMTab();
    cy.get('@empInfo').then((infoData: any) => {
      pimTab.addNewEmployee(infoData.firstName, infoData.middleName, infoData.lastName, infoData.id, infoData.userName, infoData.password, infoData.password);
    });
  });

  // it('Verify Admin - add employee response', () => {
  //   dataUtils.addEmployee('m.s.abuhasan', 'abohasan123', true, 1, 61);
  // });

  afterEach(() => {
    pimTab.openPIMTab();
    // PIM - delete employee
    cy.get('@empInfo').then((infoData: any) => {
      pimTab.deleteEmployee(infoData.id);
    })

    // Admin - delete employee response
    // dataUtils.deleteEmployee('m.s.abuhasan');
  });
});