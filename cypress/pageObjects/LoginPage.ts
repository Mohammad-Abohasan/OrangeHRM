class LoginPage {

  elements = {
    userName: () => cy.get('[placeholder="Username"]'),
    password: () => cy.get('[placeholder="Password"]'),
    loginBtn: () => cy.get('button'),
    forgotPassword: () => cy.get('.orangehrm-login-forgot-header'),
    resetPassword: () => cy.get('[type="submit"]'),
    titleResetPassword: () => cy.get('.orangehrm-forgot-password-title')
  }

  login(userName: string, password: string) {
    this.elements.userName().type(userName);
    this.elements.password().type(password);
    this.elements.loginBtn().click();
  }

  forgotYourPassword(userName: string) {
    this.elements.forgotPassword().click();
    this.elements.userName().type(userName);
    this.elements.resetPassword().click();
    this.elements.titleResetPassword().contains('Reset Password link sent successfully').as('Reset Password done'); 
  }

}

export default LoginPage;