import LoginPage from "../../../pageObjects/LoginPage";

const loginObj: LoginPage = new LoginPage();

describe('Login Page', () => {

  beforeEach(() => {
    cy.intercept('/web/index.php/dashboard/index').as('Login');
    cy.visit('/');
  });

  it('Forgot your password?', () => {
    loginObj.forgotYourPassword('Admin');
  });

});