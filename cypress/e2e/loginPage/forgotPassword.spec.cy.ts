import LoginPageActions from "../../support/pageObjects/loginPage/LoginPageActions";
import LoginPageAssertions from "../../support/pageObjects/loginPage/LoginPageAssertions";

const loginPageActions: LoginPageActions = new LoginPageActions();
const loginPageAssertions: LoginPageAssertions = new LoginPageAssertions();

describe("Login - Forgot possword functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.intercept("/web/index.php/dashboard/index").as("Login");
  });

  it("Login: Forgot your password?", () => {
    loginPageActions.forgotYourPassword("Admin");
    loginPageAssertions.checkForgotPasswordPage();
  });
});
