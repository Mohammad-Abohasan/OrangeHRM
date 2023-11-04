import SharedHelper from "../../helpers/shared-helper";

class LoginPageActions {
  elements = {
    forgotPassword: () => cy.get(".orangehrm-login-forgot-header"),
    submitButton: () => cy.getByAttribute("type", "submit"),
    userDropdown: () => cy.get(".oxd-userdropdown-tab"),
    logoutOption: () => cy.get(":nth-child(4) > .oxd-userdropdown-link"),
  };

  login(username: string, password: string) {
    username && SharedHelper.fillInInputField("Username", username);
    password && SharedHelper.fillInInputField("Password", password);
    this.elements.submitButton().click();
  }

  logout() {
    this.elements.userDropdown().click();
    this.elements.logoutOption().click();
  }

  forgotYourPassword(username: string) {
    this.elements.forgotPassword().click();
    SharedHelper.fillInInputField("Username", username);
    this.elements.submitButton().click();
  }
}

export default LoginPageActions;
