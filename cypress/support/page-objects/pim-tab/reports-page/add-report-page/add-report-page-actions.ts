import SharedHelper from "../../../../helpers/shared-helper";

export default class AddReportPageActions {
  elements = {
    addRowButtonByPreviousFieldName: (labelName: string, index: number = 0) =>
      cy.get(".oxd-input-group")
        .find(`.oxd-label:contains(${labelName})`)
        .eq(index)
        .parents()
        .eq(2)
        .find(".oxd-icon-button")
        .click(),

    getElementByLabelAndPosition: (labelName: string, position: number = 1, last: boolean = false) =>
      cy.get(".oxd-grid-item")
        .find(`p:contains(${labelName})`)
        [last ? "last" : "first"]()
        .parent()
        .nextAll("div")
        .eq(position - 1),
        
    selectOption: () => cy.get(".oxd-select-option"),
  };

  typeReportName(reportName: string) {
    SharedHelper.fillInInputField("Add - Report Name", reportName);
  }

  addSelectionCriteria(criteria: string, criteriaValue: string) {
    SharedHelper.fillInInputField("Selection Criteria", criteria);
    this.elements.addRowButtonByPreviousFieldName("Selection Criteria");
    this.elements.getElementByLabelAndPosition(criteria).click();
    this.elements.selectOption().contains(criteriaValue).click();
  }

  selectIncludeOption(option: string) {
    SharedHelper.fillInInputField("Include", option);
  }

  addDisplayFieldGroup(groupName: string, field: string, includeHeader: boolean = false) {
    SharedHelper.fillInInputField("Select Display Field Group", groupName);
    SharedHelper.fillInInputField("Select Display Field", field, 1);
    this.elements.addRowButtonByPreviousFieldName("Select Display Field", 1);
    this.elements
      .getElementByLabelAndPosition(groupName, 2, true)
      .find("[type='checkbox']")
      .then(($switch) => {
        if ($switch.prop("checked") != includeHeader) {
          cy.wrap($switch).click({ force: true });
        }
      });
  }

  saveReport() {
    SharedHelper.clickSubmitButtonIsContains("Save");
  }
}
