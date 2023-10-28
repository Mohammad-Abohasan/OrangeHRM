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

  static selectItemFromDropdown(labelName: string, itemName: string) {
    cy.get(".oxd-input-group")
      .contains(".oxd-label", labelName)
      .parents()
      .eq(1)
      .find(".oxd-select-wrapper")
      .click();
    cy.get(".oxd-select-option").contains(itemName).click();
  }

  static clickSearchButton() {
    cy.contains("[type='submit']", " Search ").click();
  }

  static clickResetButton() {
    cy.getByAttribute("type", "reset").click();
  }

  static checkToastMessage(message: string) {
    cy.contains(".oxd-toast", message).should("exist");
  }

  static mainMenuItems() {
    return cy.get(".oxd-sidepanel-body");
  }

  static selectOptionFromListBox(option: string) {
    cy.getByAttribute("role", "option")
      .contains("Searching....")
      .should("not.exist");
    cy.getByAttribute("role", "listbox")
      .contains("[role=option]", option)
      .click();
  }

  static checkRows(rowSelector: string, args: {}[]) {
    const headers: string[] = [];
    cy.get(rowSelector)
      .eq(0)
      .children()
      .each(($cell) => {
        const cellStr: string = $cell
          .text()
          .replace(/AscendingDescending|Actions/g, "")
          .trim();
        if (cellStr) headers.push(cellStr);
      });

    args.forEach((rowData: any, rowInd) => {
      cy.get(rowSelector)
        .eq(++rowInd)
        .children()
        .then((cellsOfRow) => {
          for (let i = 0; i < headers.length; i++) {
            cy.wrap(cellsOfRow)
              .eq(i + 1)
              .should("contain", rowData[headers[i]]);
          }
        });
    });
  }
}
