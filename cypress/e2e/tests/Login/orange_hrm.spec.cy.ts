import LoginPage from "../../../pageObjects/LoginPage";

const loginObj: LoginPage = new LoginPage();

describe('Login Page', () => {

  beforeEach(() => {
    cy.intercept('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index').as('Login');
    cy.visit('https://opensource-demo.orangehrmlive.com');

    // Valid Login
    loginObj.login('Admin', 'admin123');
  });

  it('Verify PIM add employee response', () => {
    cy.request({
      method: 'POST',
      url: 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users',
      body: {
        username: 'Mohammad Abohasan', 
        password: 'abohasan123',
        status: true, 
        userRoleId: 1, 
        empNumber: 53
      }
    }).then((response) => {
      expect(response).property(`status`).to.equal(200);
    });
  });

  it('Verify employees locations response', () => {
    cy.request('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/dashboard/employees/locations')
      .then((response) => {
        expect(response).property(`status`).to.equal(200);
      });
  });

  it('Verify shortcuts response', () => {
    cy.request('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/dashboard/shortcuts')
      .then((response) => {
        expect(response).property(`status`).to.equal(200);
      });
  });

});