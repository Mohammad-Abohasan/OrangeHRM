class PIMTab {
  elements = {
    mainMenuItems: () => cy.get(".oxd-sidepanel-body"),
    addEmp: () => cy.get(".oxd-button--secondary"),
    employeeInputName: () => cy.get(".--name-grouped-field"),
    employeeInputId: () =>
      cy.get(":nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input"),
    createLoginDetails: () => cy.get('input[type="checkbox"]'),
    userName: () =>
      cy.get(
        ":nth-child(4) > .oxd-grid-2 > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input"
      ),
    passwords: () => cy.get('input[type="password"]'),
    saveEmp: () => cy.get('button[type="submit"]'),
    result: () => cy.get(".oxd-toast"),
    loading: () => cy.get(".oxd-loading-spinner-container"),

    employeeInputNickName: () =>
      cy.get(
        ":nth-child(1) > .oxd-grid-3 > .oxd-grid-item > .oxd-input-group > :nth-child(2) > .oxd-input"
      ),
    employeeInputDriversLicenseNumber: () =>
      cy.get(
        ":nth-child(3) > :nth-child(2) > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input"
      ),
    employeeInputLicenseExpiryDate: () =>
      cy.get(
        ":nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-date-wrapper > .oxd-date-input > .oxd-input"
      ),
    employeeInputMaritalStatus: () =>
      cy.get(
        ":nth-child(5) > :nth-child(1) > :nth-child(2) > .oxd-input-group > .oxd-input-group__label-wrapper > .oxd-label"
      ).parents()
      .eq(1)
      .children()
      .eq(1),
    employeeInputDateOfBirth: () =>
      cy.get(
        ":nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-date-wrapper > .oxd-date-input > .oxd-input"
      ),
    employeeInputGender: () =>
      cy.get(":nth-child(5) > :nth-child(2) > :nth-child(2)"),

    closeCalendar: () => cy.get(".--close"),
    dropDownOptions: () => cy.get(".oxd-select-dropdown"),

    employeeSearchId: () => cy.get("input").eq(2),
    searchBtn: () => cy.get(".orangehrm-left-space"),
    resultData: () => cy.get(".oxd-table-cell"),
    editAction: () =>
      cy.get(
        ":nth-child(1) > .oxd-table-row > :nth-child(9) > .oxd-table-cell-actions > :nth-child(2)"
      ),
    deleteAction: () =>
      cy.get(
        ":nth-child(1) > .oxd-table-row > :nth-child(9) > .oxd-table-cell-actions > :nth-child(1)"
      ),
    deleteBtn: () => cy.get(".oxd-button--label-danger"),
  };

  openPIMTab() {
    this.elements.mainMenuItems().contains("PIM").click();
  }

  addEmployee(
    firstName: string,
    middleName: string,
    lastName: string,
    employeeId: number,
    userName: string,
    password: string,
    confirmPassword: string
  ) {
    this.openPIMTab();
    this.elements.addEmp().eq(1).click();
    this.elements.employeeInputName().children().eq(0).type(firstName);
    this.elements.employeeInputName().children().eq(1).type(middleName);
    this.elements.employeeInputName().children().eq(2).type(lastName);
    this.elements.employeeInputId().clear().type(`${employeeId}`);
    this.elements.createLoginDetails().click({ force: true });
    this.elements.userName().type(userName);
    this.elements.passwords().eq(0).type(password);
    this.elements.passwords().eq(1).type(confirmPassword);
    this.elements.saveEmp().click();
    this.elements
      .result()
      .contains("Successfully Saved")
      .as("Successfully Added Employee");
  }

  editPersonalDetails(
    id: string,
    nickName: string,
    driversLicenseNumber: string,
    licenseExpiryDate: string,
    maritalStatus: string,
    dateOfBirth: string,
    gender: string
  ) {
    this.openPIMTab();
    this.elements.employeeSearchId().type(id);
    this.elements.searchBtn().click({ force: true });
    this.elements.editAction().click();
    this.elements.employeeInputNickName().type(nickName);
    this.elements
      .employeeInputDriversLicenseNumber()
      .type(driversLicenseNumber);
    this.elements.employeeInputLicenseExpiryDate().clear().type(licenseExpiryDate);
    this.elements.closeCalendar().click();
    this.elements.employeeInputMaritalStatus().click();
    this.elements.dropDownOptions().contains(maritalStatus).click();
    this.elements.employeeInputDateOfBirth().clear().type(dateOfBirth);
    this.elements.closeCalendar().click();
    this.elements.employeeInputGender().contains(gender).click({ force: true });
    this.elements.saveEmp().eq(0).click();
    this.elements
      .result()
      .contains("Successfully Updated")
      .as("Successfully Updated Employee Information");
  }

  deleteEmployee(id: string) {
    this.openPIMTab();
    this.elements.employeeSearchId().type(id);
    this.elements.searchBtn().click({ force: true });
    this.elements.deleteAction().click();
    this.elements.deleteBtn().click();
    this.elements
      .result()
      .contains("Successfully Deleted")
      .as("Successfully Deleted Employee");
  }

  searchEmployee([
    id,
    firstName,
    middleName,
    lastName,
    jobTitle,
    employmentStatus,
    subUnit,
    supervisor,
  ]: any) {
    this.openPIMTab();
    this.elements.employeeSearchId().type(id);
    this.elements.searchBtn().click({ force: true });
    this.elements.resultData().eq(1).should("contain", id);
    this.elements
      .resultData()
      .eq(2)
      .should("contain", `${firstName} ${middleName}`);
    this.elements.resultData().eq(3).should("contain", lastName);
    this.elements.resultData().eq(4).should("contain", jobTitle);
    this.elements.resultData().eq(5).should("contain", employmentStatus);
    this.elements.resultData().eq(6).should("contain", subUnit);
    this.elements.resultData().eq(7).should("contain", supervisor);
  }
}

export default PIMTab;
