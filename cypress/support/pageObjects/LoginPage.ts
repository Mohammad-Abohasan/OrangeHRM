class LoginPage {
  elements = {
    userName: () => cy.getByAttribute("placeholder", "Username"),
    password: () => cy.getByAttribute("placeholder", "Password"),
    loginBtn: () => cy.get("button"),
    forgotPassword: () => cy.getByClass("orangehrm-login-forgot-header"),
    resetPassword: () => cy.getByAttribute("type", "submit"),
    titleResetPassword: () => cy.getByClass("orangehrm-forgot-password-title"),

    alertLogin: () => cy.get(".oxd-alert-content-text"),
    dashboardLabel: () => cy.get(".oxd-topbar-header-breadcrumb > .oxd-text"),
    userDropdown: () => cy.get(".oxd-userdropdown-tab"),
    logoutOption: () => cy.get(":nth-child(4) > .oxd-userdropdown-link"),
  };

  login(userName: string, password: string) {
    userName && this.elements.userName().type(userName);
    password && this.elements.password().type(password);
    this.elements.loginBtn().click();
  }

  checkValidLogin(msg: string) {
    this.elements.dashboardLabel().contains(msg).as("Login Successfully");
  }

  checkInvalidLogin(msg: string) {
    this.elements.alertLogin().contains(msg).as("Login Failed");
  }

  checkUserNameInputErrorMessageContainsValue(msg: string) {
    this.elements
      .userName()
      .parents()
      .eq(1)
      .contains("span", msg)
      .should("exist")
      .as("Login Failed");
  }

  checkPasswordInputErrorMessageContainsValue(msg: string) {
    this.elements
      .password()
      .parents()
      .eq(1)
      .contains("span", msg)
      .should("exist")
      .as("Login Failed");
  }

  passwordIsHidden() {
    this.elements
      .password()
      .should("have.attr", "type", "password")
      .as("Password is hidden");
  }

  logout() {
    this.elements.userDropdown().click();
    this.elements.logoutOption().click();
  }

  forgotYourPassword(userName: string) {
    this.elements.forgotPassword().click();
    this.elements.userName().type(userName);
    this.elements.resetPassword().click();
    this.elements
      .titleResetPassword()
      .contains("Reset Password link sent successfully")
      .as("Reset Password done");
  }
}

export default LoginPage;
