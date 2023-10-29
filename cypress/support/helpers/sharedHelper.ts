export default class SharedHelper {
  static getHeaderIndex(headerName: string) {
    return cy
      .get(".oxd-table-header")
      .children()
      .first()
      .contains("[role='columnheader']", headerName)
      .invoke("index");
  }

  static checkRecordsContainsValueInColumn(
    rowNumber: number,
    headerName: string,
    value: string
  ) {
    this.getHeaderIndex(headerName).then((headerIndex) => {
      cy.get(".oxd-table-body")
        .find("div[role=row]")
        .eq(rowNumber)
        .find("div[role=cell]")
        .eq(headerIndex)
        .contains(value)
        .should("exist");
    });
  }

  static clickSearchButton() {
    cy.contains("[type='submit']", " Search ").click();
  }

  static clickResetButton() {
    cy.getByAttribute("type", "reset").click();
  }

  static checkToastIsExist(isExist: boolean) {
    cy.get(".oxd-toast").should(isExist ? "exist" : "not.exist");
  }

  static checkToastMessage(message: string) {
    cy.contains(".oxd-toast", message).should("exist");
  }

  static mainMenuItems() {
    return cy.get(".oxd-sidepanel-body");
  }

  static checkLoadingSpinnerIsExist(isExist: boolean) {
    cy.get(".oxd-loading-spinner-container").should(
      isExist ? "exist" : "not.exist"
    );
  }

  static selectItemFromDropdown(labelName: string, itemName: string) {
    cy.get(".oxd-input-group")
      .contains(".oxd-label", labelName)
      .parents()
      .eq(1)
      .find(".oxd-select-wrapper")
      .click();
    cy.get(".oxd-select-option").contains(itemName).click();
  }

  static selectOptionFromListBox(labelName: string, option: string) {
    cy.get(".oxd-input-group")
      .contains(".oxd-label", labelName)
      .parents()
      .eq(1)
      .find("[placeholder='Type for hints...']")
      .type(option)
      .contains("Searching....")
      .should("not.exist");
    cy.getByAttribute("role", "listbox")
      .contains("[role=option]", option)
      .click();
  }

  static selectDateFromCalendar(labelName: string, date: string) {
    cy.get(".oxd-input-group")
      .contains(".oxd-label", labelName)
      .parents()
      .eq(1)
      .find(".oxd-date-input > .oxd-input")
      .type(date);

    // close calendar
    cy.contains(".oxd-date-input-link", "Close").click();
  }
}
