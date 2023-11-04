import LoginPageActions from "../../../support/page-objects/login-page/login-page-actions";
import LoginPageAssertions from "../../../support/page-objects/login-page/login-page-assertions";

const loginPageActions: LoginPageActions = new LoginPageActions();
const loginPageAssertions: LoginPageAssertions = new LoginPageAssertions();

describe("Login - Forgot password functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.intercept("/web/index.php/dashboard/index").as("Login");
  });

  it("Login: Forgot your password?", () => {
    loginPageActions.forgotYourPassword("Admin");
    loginPageAssertions.checkForgotPasswordPage();
  });
});
