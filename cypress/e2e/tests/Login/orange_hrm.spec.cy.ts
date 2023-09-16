import LoginPage from "../../../pageObjects/LoginPage";

const loginObj: LoginPage = new LoginPage();

describe('Login Page', () => {

  beforeEach(() => {
    cy.intercept('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index').as('Login');
    cy.visit('https://opensource-demo.orangehrmlive.com');
  });

  it('Valid Login', () => {
    loginObj.login('Admin', 'admin123');
  });

  it('Forgot your password?', () => {
    loginObj.forgotYourPassword('Admin');
  });

})