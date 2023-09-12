class LoginPage {

  elements = {
    userName: () => cy.get('[placeholder="Username"]'),
    password: () => cy.get('[placeholder="Password"]'),
    loginBtn: () => cy.get('button')
  }

  login(userName: string, password: string) {
    this.elements.userName().type(userName);
    this.elements.password().type(password);
    this.elements.loginBtn().click();
  }

}

export default LoginPage;