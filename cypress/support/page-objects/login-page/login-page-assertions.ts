class LoginPageAssertions {
  elements = {
    usernameField: () => cy.getByAttribute("placeholder", "Username"),
    passwordField: () => cy.getByAttribute("placeholder", "Password"),
    titleResetPassword: () => cy.get(".orangehrm-forgot-password-title"),
    alertLogin: () => cy.get(".oxd-alert-content-text"),
    dashboardLabel: () => cy.get(".oxd-topbar-header-breadcrumb > .oxd-text"),
  };

  checkValidLogin(msg: string) {
    this.elements.dashboardLabel().contains(msg).as("Login Successfully");
  }

  checkInvalidLogin(msg: string) {
    this.elements.alertLogin().contains(msg).as("Login Failed");
  }

  checkUsernameInputErrorMessageContainsValue(msg: string) {
    this.elements
      .usernameField()
      .parents()
      .eq(1)
      .contains("span", msg)
      .should("exist")
      .as("Login Failed");
  }

  checkPasswordInputErrorMessageContainsValue(msg: string) {
    this.elements
      .passwordField()
      .parents()
      .eq(1)
      .contains("span", msg)
      .should("exist")
      .as("Login Failed");
  }

  passwordIsHidden() {
    this.elements
      .passwordField()
      .should("have.attr", "type", "password")
      .as("Password is hidden");
  }

  checkForgotPasswordPage()  {
    this.elements
      .titleResetPassword()
      .contains("Reset Password link sent successfully")
      .as("Reset Password done");
  }
}

export default LoginPageAssertions;
