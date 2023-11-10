export default class ReportsPageAssertions {
  elements = {
    reportName: () => cy.get(".orangehrm-main-title"),
    topHeader: () => cy.get(".rgHeaderCell").children(),
    numberOfRows: () => cy.get(".oxd-text--count"),
  };

  verifyReportName(reportName: string) {
    this.elements.reportName().should("have.text", reportName);
  }

  checkTopHeaders(reportGroupHeaders: string[]) {
    Cypress._.each(reportGroupHeaders, (headerName) => {
      this.elements.topHeader().contains(".header-content", headerName);
    });
  }

  checkReportContents(employeesData: any, reportGroupData: any) {
    Cypress._.times(employeesData.length, (count) => {
      this.checkReportContainsValueInColumn(
        count,
        reportGroupData["Personal"].field,
        employeesData[count].firstName
      );
      this.checkReportContainsValueInColumn(
        count,
        reportGroupData["Job"].field,
        employeesData[count].jobTitle
      );
      this.checkReportContainsValueInColumn(
        count,
        reportGroupData["Salary"].field,
        employeesData[count].salaryAmount
      );
    });
  }

  verifyNumberOfRows(numberOfEmployees: number) {
    this.elements.numberOfRows().should("have.text", ` (${numberOfEmployees}) Records Found`);
  }

  getHeaderIndex(headerName: string) {
    return cy
      .get(".header-rgRow")
      .children()
      .contains(".header-content", headerName)
      .parent()
      .invoke("index");
  }

  checkReportContainsValueInColumn(rowNumber: number, headerName: string, value: string) {
    this.getHeaderIndex(headerName).then((headerIndex) => {
      cy.get(".rgRow")
        .find(`[data-rgrow=${rowNumber}]`)
        .contains(`[data-rgcol=${headerIndex}]`, value);
    });
  }
}
