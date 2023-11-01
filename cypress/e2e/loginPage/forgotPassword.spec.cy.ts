import LoginPage from "../../support/pageObjects/loginPage/LoginPage";

const loginObj: LoginPage = new LoginPage();

describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/");  
    cy.intercept("/web/index.php/dashboard/index").as("Login");
  });

  it("Forgot your password?", () => {
    loginObj.forgotYourPassword("Admin");
  });
});
