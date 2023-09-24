import LoginPage from "../../../support/pageObjects/LoginPage";
import DataUtils from "../../../support/DataUtils";
import PIMTab from "../../../support/pageObjects/PIMTab";

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

  // it('Verify Admin - add employee response', () => {
  //   dataUtils.adminTab.addEmployee('m.s.abuhasan', 'abohasan123', true, 1, 61);
  // });

  afterEach(() => {
    // Admin - delete employee response
    // dataUtils.adminTab.deleteEmployee('m.s.abuhasan');
  });
});