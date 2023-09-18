class PIMTab {

  elements = {
    mainMenuItems: () => cy.get('.oxd-sidepanel-body'),
    addEmp: () => cy.get('.oxd-button--secondary'),
    employeeInputName: () => cy.get('.--name-grouped-field'),
    saveNewEmp: () => cy.get('button[type="submit"]'),
    createLoginDetails: () => cy.get('input[type="checkbox"]'),
    userName: () => cy.get(':nth-child(4) > .oxd-grid-2 > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input'),
    // .oxd-input-group > :nth-child(2) > .oxd-input
    password: () => cy.get('input[type="password"]'),
    result: () => cy.get('.oxd-toast-container')
  }

  addNewEmployee(firstName: string, middleName: string, lastName: string, userName: string, password: string, confirmPassword: string) {
    this.elements.mainMenuItems().contains('PIM').click();
    this.elements.addEmp().eq(1).click();
    this.elements.employeeInputName().children().eq(0).type(firstName);
    this.elements.employeeInputName().children().eq(1).type(middleName);
    this.elements.employeeInputName().children().eq(2).type(lastName);

    this.elements.createLoginDetails().click({ force: true });
    this.elements.userName().type(userName);
    this.elements.password().eq(0).type(password);
    this.elements.password().eq(1).type(confirmPassword);

    this.elements.saveNewEmp().click();

    this.elements.result().contains('Successfully Saved').as('Successfully Added Employee'); 
  }

}

export default PIMTab;