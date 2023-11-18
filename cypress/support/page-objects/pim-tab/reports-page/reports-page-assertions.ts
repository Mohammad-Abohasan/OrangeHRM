import { reportToEmployeeFieldAdapter } from './../../../helpers/pim-tab/reports-page/reports-helper';
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

  checkReportContents(employeesData: any, reportGroup: any) {
    Cypress._.times(employeesData.length, (count) => {
      Cypress._.each(Object.keys(reportGroup), (groupKey: any) => {
        const reportField = reportGroup[groupKey].field;
        const employeeField = employeesData[count][reportToEmployeeFieldAdapter[reportField]];
        this.checkReportContainsValueInColumn(
          count,
          reportField,
          employeeField
        );
      });
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
