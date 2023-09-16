class LoginPage {

  elements = {
    userName: () => cy.getByAttribute('placeholder', 'Username'),
    password: () => cy.getByAttribute('placeholder', 'Password'),
    loginBtn: () => cy.get('button'),
    forgotPassword: () => cy.getByClass('.orangehrm-login-forgot-header'),
    resetPassword: () => cy.getByAttribute('type', 'submit'),
    titleResetPassword: () => cy.getByClass('.orangehrm-forgot-password-title')
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