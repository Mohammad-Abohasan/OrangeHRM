import PIMSearch from "./PIMSearch";
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
    saveEmp: () => cy.get('button[type="submit"]'),
    result: () => cy.get('.oxd-toast'),
    loading: () => cy.get('.oxd-loading-spinner-container'),

    employeeInputNickName: () => cy.get(':nth-child(1) > .oxd-grid-3 > .oxd-grid-item > .oxd-input-group > :nth-child(2) > .oxd-input'),
    employeeInputDriversLicenseNumber: () => cy.get(':nth-child(3) > :nth-child(2) > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input'),
    employeeInputLicenseExpiryDate: () => cy.get(':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-date-wrapper > .oxd-date-input > .oxd-input'), 
    employeeInputMaritalStatus: () => cy.get(':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text'),
    employeeInputDateOfBirth: () => cy.get(':nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-date-wrapper > .oxd-date-input > .oxd-input'),
    employeeInputGender: () => cy.get(':nth-child(5) > :nth-child(2) > :nth-child(2)'),
    // employeeInputMaleGender: () => cy.get(':nth-child(1) > :nth-child(2) > .oxd-radio-wrapper'),
    // employeeInputFemaleGender: () => cy.get(':nth-child(2) > :nth-child(2) > .oxd-radio-wrapper'),

    closeCalendar: () => cy.get('.--close'),
    dropDownOptions: () => cy.get('.oxd-select-dropdown'),

    employeeSearchId: () => cy.get('input').eq(2),
    searchBtn: () => cy.get('.orangehrm-left-space'),
    resultData: () => cy.get('.oxd-table-cell'),
    editAction: () => cy.get(':nth-child(1) > .oxd-table-row > :nth-child(9) > .oxd-table-cell-actions > :nth-child(2)'),
    deleteAction: () => cy.get(':nth-child(1) > .oxd-table-row > :nth-child(9) > .oxd-table-cell-actions > :nth-child(1)'),
    deleteBtn: () => cy.get('.oxd-button--label-danger')
  }

  openPIMTab() {
    this.elements.mainMenuItems().contains('PIM').click();
  }

  addEmployee(firstName: string, middleName: string, lastName: string, id: number, userName: string, password: string, confirmPassword: string) {
    this.openPIMTab();
    this.elements.addEmp().eq(1).click();
    this.elements.employeeInputName().children().eq(0).type(firstName);
    this.elements.employeeInputName().children().eq(1).type(middleName);
    this.elements.employeeInputName().children().eq(2).type(lastName);
    this.elements.employeeInputId().clear().type(`${id}`);
    this.elements.createLoginDetails().click({ force: true });
    this.elements.userName().type(userName);
    this.elements.passwords().eq(0).type(password);
    this.elements.passwords().eq(1).type(confirmPassword);
    this.elements.saveEmp().click();
    this.elements.result().contains('Successfully Saved').as('Successfully Added Employee');
  }

  editPersonalDetails(id: string, nickName: string, driversLicenseNumber: string, licenseExpiryDate: string, maritalStatus: string, dateOfBirth: string, gender: string) {
    this.openPIMTab();
    this.elements.employeeSearchId().type(id);
    this.elements.searchBtn().click({ force: true });
    this.elements.editAction().click();
    this.elements.employeeInputNickName().type(nickName);
    this.elements.employeeInputDriversLicenseNumber().type(driversLicenseNumber);
    this.elements.employeeInputLicenseExpiryDate().type(licenseExpiryDate);
    this.elements.closeCalendar().click();
    this.elements.employeeInputMaritalStatus().click();
    this.elements.dropDownOptions().contains(maritalStatus).click();
    this.elements.employeeInputDateOfBirth().type(dateOfBirth);
    this.elements.closeCalendar().click();
    this.elements.employeeInputGender().contains(gender).click({ force: true});
    this.elements.saveEmp().eq(0).click();
    this.elements.result().contains('Successfully Updated').as('Successfully Updated Employee Information');
  }

  deleteEmployee(id: string) {
    this.openPIMTab();
    this.elements.employeeSearchId().type(id);
    this.elements.searchBtn().click({ force: true });
    this.elements.deleteAction().click();
    this.elements.loading().should('not.exist');
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