import SharedHelper from "../../../helpers/shared-helper";

export default class CandidatesPageAssertions {
  elements = {
    candidatesTable: () => cy.get(".oxd-table-body > .oxd-table-card"),
    statusLabel: () => cy.get(".oxd-text--subtitle-2"),
    resumeName: () => cy.get(".orangehrm-file-preview > .oxd-text"),
    resultToast: () => cy.get(".oxd-toast"),
    applicationStageButtons: () =>
      cy.get(".orangehrm-card-container").find("[type=button]"),
  };

  checkButtonIsAvailable(buttonName: string) {
    this.elements
      .applicationStageButtons()
      .contains(` ${buttonName} `)
      .should("be.visible");
  }

  checkNumberOfRecords(length: number) {
    this.elements.candidatesTable().should("have.length", length);
  }

  checkStatus(status: string) {
    this.elements.statusLabel().should("contain", status);
  }

  checkResumeName(name: string) {
    this.elements.resumeName().should("contain", name);
  }

  checkRecordsContainsCandidate(candidateData: any) {
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Vacancy",
      candidateData["Vacancy"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Candidate",
      candidateData["Candidate"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Hiring Manager",
      candidateData["Hiring Manager"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Date of Application",
      candidateData["Date of Application"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Status",
      candidateData["Status"]
    );
  }
}
