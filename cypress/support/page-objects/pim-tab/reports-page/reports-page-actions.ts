import SharedHelper from "../../../helpers/shared-helper";
import PimTabActions from "../pim-tab-actions";
import AddReportPageActions from "./add-report-page/add-report-page-actions";

const pimTabActions: PimTabActions = new PimTabActions();
const addReportPageActions: AddReportPageActions = new AddReportPageActions();
export default class ReportsPageActions {
  elements = {
    tableCellActions: () => cy.get(".oxd-table-cell-actions"),
    confirmDeleteButton: () => cy.get(".oxd-button--label-danger"),
  };

  openReportsPage() {
    cy.intercept("/web/index.php/core/i18n/messages").as("messages");
    cy.intercept("/web/index.php/api/v2/pim/reports/**").as("reports");

    pimTabActions.openPimTab();
    SharedHelper.topBarItems().contains("Reports").click();
    cy.wait(["@messages", "@reports"]);
  }

  addReport(reportData: any) {
    const { name, include, criteria, group } = reportData;
    cy.intercept("/web/index.php/core/i18n/messages").as("messages");
    cy.intercept("/web/index.php/api/v2/pim/reports/**").as("reports");

    SharedHelper.addButton().click({ force: true });
    cy.wait(["@messages", "@reports"]).then(() => {
      addReportPageActions.typeReportName(name);
      // Select all criteria
      Cypress._.each(Object.keys(criteria), (criteriaKey: any) => {
        addReportPageActions.addSelectionCriteria(
          criteriaKey,
          criteria[criteriaKey]
        );
      });
      addReportPageActions.selectIncludeOption(include);
      // Select all display fields
      Cypress._.each(Object.keys(group), (groupKey: any) => {
        addReportPageActions.addDisplayFieldGroup(
          groupKey,
          group[groupKey].field,
          group[groupKey].includeHeader
        );
      });
      addReportPageActions.saveReport();
    });
  }

  searchReport(reportName: string) {
    SharedHelper.fillInInputField("Search - Report Name", reportName);
    SharedHelper.clickSubmitButtonIsContains("Search");
  }

  deleteReport() {
    this.elements.tableCellActions().find(".bi-trash").click();
    this.elements.confirmDeleteButton().click();
  }
}
