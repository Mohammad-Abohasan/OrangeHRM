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
        .invoke("text")
        .then(($tableValue: string) => {
          if ($tableValue.length > 0) {
            cy.wrap($tableValue).should("contain", value);
          } else {
            expect($tableValue).to.be.empty;
          }
        });
    });
  }

  static selectAllRecordsFoundAndDelete() {
    cy.get(".oxd-table-row").then(($rows) => {
      if ($rows.length > 1) {
        cy.get(".oxd-table-header")
          .find("[type='checkbox']")
          .click({ force: true });
        cy.get(".oxd-button--label-danger").click({ force: true });
        cy.get(".oxd-button--label-danger").eq(1).click();
        this.checkToastMessage("Successfully Deleted");
      }
    });
  }

  static clickSubmitButtonIsContains(buttonText: string) {
    cy.contains("[type='submit']", ` ${buttonText} `).click();
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
      .find(".oxd-select-text")
      .click();
    cy.get(".oxd-select-option").contains(itemName).click();
  }

  static deselectOptionsFromMultiSelect(labelName: string) {
    cy.get(".oxd-input-group")
      .contains(".oxd-label", labelName)
      .parents()
      .eq(1)
      .find(".--clear")
      .as("clearItemsButton");
    cy.get("@clearItemsButton").then(($clearItemsButton) => {
      for (let i = 0; i < $clearItemsButton.length; i++) {
        cy.get("@clearItemsButton").eq(0).click();
      }
    });
  }

  static typeInInputField(labelName: string, value: string) {
    cy.get(".oxd-input-group")
      .contains(".oxd-label", labelName)
      .parents()
      .eq(1)
      .find("input")
      .type(value);
  }

  static selectOptionFromListBox(labelName: string, option: string) {
    cy.get(".oxd-input-group")
      .contains(".oxd-label", labelName)
      .parents()
      .eq(1)
      .find("[placeholder='Type for hints...']")
      .type(option);
    cy.getByAttribute("role", "listbox")
      .contains("[role=option]", "Searching....")
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
      .clear()
      .type(date);

    // close calendar
    cy.contains(".oxd-date-input-link", "Close").click();
  }
}
