export default class Common {
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

  static deleteAllRecords(
    selectAllRecords: string,
    deleteBtn: string,
    confirmDeleteBtn: string
  ) {
    cy.get(selectAllRecords).eq(0).click();
    cy.get(deleteBtn).click();
    cy.get(confirmDeleteBtn).eq(1).click();
  }
}
