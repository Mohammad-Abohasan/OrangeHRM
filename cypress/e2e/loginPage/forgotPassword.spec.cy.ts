import LoginPageActions from "../../support/pageObjects/loginPage/LoginPageActions";
import LoginPageAssertions from "../../support/pageObjects/loginPage/LoginPageAssertions";

const loginPageActions: LoginPageActions = new LoginPageActions();
const loginPageAssertions: LoginPageAssertions = new LoginPageAssertions();

describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.intercept("/web/index.php/dashboard/index").as("Login");
  });

  it("Forgot your password?", () => {
    loginPageActions.forgotYourPassword("Admin");
    loginPageAssertions.checkForgotPasswordPage();
  });
});
