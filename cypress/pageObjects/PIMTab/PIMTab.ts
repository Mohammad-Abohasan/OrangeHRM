import PIMSearch from "./PIMSearch";
import 'cypress-wait-until';

const pimSearch: PIMSearch = new PIMSearch();

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

    loading: () => cy.get('.oxd-loading-spinner-container'),

    employeeInputNickName: () => cy.get('.oxd-input').eq(4),

    employeeSearchId: () => cy.get('input').eq(2),
    searchBtn: () => cy.get('.orangehrm-left-space'),
    resultData: () => cy.get('.oxd-table-cell'),
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

  editPersonalDetails(nickName: string, driversLicenseNumber: string, licenseExpiryDate: string, maritalStatus: string, dateOfBirth: string, gender: string) {
    this.elements.loading().should('not.exist');
    this.elements.loading().should('not.exist');
    this.elements.employeeInputNickName().type(nickName);

    this.elements.saveNewEmp().eq(0).click();
    this.openPIMTab();

    // this.elements.result().contains('Successfully Saved').as('Successfully Edited Employee');
  }

  deleteEmployee(id: string) {
    this.elements.employeeSearchId().type(id);
    this.elements.searchBtn().click({ force: true });
    this.elements.resultActions().children().eq(0).click();
    this.elements.deleteBtn().click();
    this.elements.result().contains('Successfully Deleted').as('Successfully Deleted Employee');
  }

  // ===================================
  // searchEmployee(empInfo: { key: string, value: string }[]) {
  //   for (let i = 0; i < empInfo.length; i++) {
  //     pimSearch.search(empInfo[i]);
  //   }

  //   this.elements.searchBtn().click({ force: true });

  //   for (let i = 0; i < empInfo.length; i++) {
  //     pimSearch.checkSearch(empInfo[i]);
  //   }
  // }
  // ===================================

}

export default PIMTab;
