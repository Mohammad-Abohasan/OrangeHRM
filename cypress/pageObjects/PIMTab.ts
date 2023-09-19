class PIMTab {

  elements = {
    mainMenuItems: () => cy.get('.oxd-sidepanel-body'),
    addEmp: () => cy.get('.oxd-button--secondary'),
    employeeInputName: () => cy.get('.--name-grouped-field'),
    employeeInputId: () => cy.get(':nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input'),
    createLoginDetails: () => cy.get('input[type="checkbox"]'),
    userName: () => cy.get(':nth-child(4) > .oxd-grid-2 > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input'),
    passwords: () => cy.get('input[type="password"]'),
    saveNewEmp: () => cy.get('button[type="submit"]'),
    result: () => cy.get('.oxd-toast'),

    employeeSearchId: () => cy.get('.oxd-input').eq(1),
    searchBtn: () => cy.get('.orangehrm-left-space'),
    resultActions: () => cy.get('.oxd-table-cell-actions'),
    deleteBtn: () => cy.get('.oxd-button--label-danger')
  }

  openPIMTab() {
    this.elements.mainMenuItems().contains('PIM').click();
  }

  addNewEmployee(firstName: string, middleName: string, lastName: string, id: number, userName: string, password: string, confirmPassword: string) {
    this.elements.addEmp().eq(1).click();
    this.elements.employeeInputName().children().eq(0).type(firstName);
    this.elements.employeeInputName().children().eq(1).type(middleName);
    this.elements.employeeInputName().children().eq(2).type(lastName);
    this.elements.employeeInputId().clear().type(`${id}`);
    this.elements.createLoginDetails().click({ force: true });
    this.elements.userName().type(userName);
    this.elements.passwords().eq(0).type(password);
    this.elements.passwords().eq(1).type(confirmPassword);

    this.elements.saveNewEmp().click();

    this.elements.result().contains('Successfully Saved').as('Successfully Added Employee'); 
  }

  deleteEmployee(id: number){
    this.elements.employeeSearchId().type(`${id}`);
    this.elements.searchBtn().click({ force: true });
    this.elements.resultActions().children().eq(0).click();
    this.elements.deleteBtn().click();
    this.elements.result().contains('Successfully Deleted').as('Successfully Deleted Employee');
  }

}

export default PIMTab;