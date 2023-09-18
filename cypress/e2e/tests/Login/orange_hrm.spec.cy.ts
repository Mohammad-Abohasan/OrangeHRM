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

    // Valid Login
    loginPage.login('Admin', 'admin123');

    cy.fixture('employeeInfoPIM').as('empInfo');
  });

  it('PIM add employee', () => {
    cy.get('@empInfo').then((infoData: any) => {
      pimTab.addNewEmployee(infoData.firstName, infoData.middleName, infoData.lastName, 'm.s.abohasan', 'mohammad123', 'mohammad123');
    })
  });

  it('Verify PIM add employee response', () => {
    dataUtils.addEmployee('m.s.abuhasan', 'abohasan123', true, 1, 61);
  });

  afterEach(() => {
    dataUtils.deleteEmployee('m.s.abuhasan');
  });
});