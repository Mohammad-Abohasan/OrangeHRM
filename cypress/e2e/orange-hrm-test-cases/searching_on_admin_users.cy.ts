describe('Searching on Admin Users', () => {

  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    const username: string = 'Admin';
    const password: string = 'admin123';
    cy.get('div.oxd-form-row:nth-child(2) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)').type(username);
    cy.get('div.oxd-form-row:nth-child(3) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)').type(password);

    cy.get('.oxd-button').click();
    cy.get('li.oxd-main-menu-item-wrapper:nth-child(1)').click();
  })


  it('Check Search with valid Username, Admin User Role, and Disabled Status', () => {
    // valid Username
    const username: string = 'abohasan';
    cy.get('input.oxd-input:nth-child(1)').type(username);

    // Admin User Role
    cy.get('div.oxd-grid-item:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').click();
    cy.get('.oxd-select-dropdown > :nth-child(2)').click();

    // Disabled Status
    cy.get('div.oxd-grid-item:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').click();
    cy.get('.oxd-select-dropdown > :nth-child(3)').click();

    // Search
    cy.get('form.oxd-form div.oxd-form-actions button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space')
      .click({ force: true })
      .should('have.length', 1);
  });
})