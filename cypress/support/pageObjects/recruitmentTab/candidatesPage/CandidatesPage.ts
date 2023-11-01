export default class CandidatesPage {
  elements = {
    mainMenuItems: () => cy.get(".oxd-sidepanel-body"),
    pages: () => cy.get(".oxd-topbar-body-nav-tab"),
    candidatesTable: () => cy.get(".oxd-table-body > .oxd-table-card"),
    loadingSpinner: () => cy.get(".oxd-loading-spinner-container"),
    scheduleInterviewBtn: () => cy.get(".oxd-button--success"),
    labels: () => cy.get(".oxd-label"),
    autoCompleteInput: () => cy.get(".oxd-autocomplete-text-input > input"),
    autoCompleteOptions: () => cy.get(".oxd-autocomplete-option"),
    dateInput: () => cy.get(".oxd-date-input"),
    timeInput: () => cy.get(".oxd-time-input"),
    submitBtn: () => cy.get('button[type="submit"]'),
    statusLabel: () => cy.get(".oxd-text--subtitle-2"),

    editSwitch: () => cy.get(".oxd-switch-input"),
    fileInput: () => cy.get("input[type='file']"),
    resumeName: () => cy.get('.orangehrm-file-preview > .oxd-text'),
    tableLoader: () => cy.get(".oxd-table-loader"),
    resultToast: () => cy.get(".oxd-toast")
  };

  openCandidatesPage() {
    this.elements.mainMenuItems().contains("Recruitment").click();
    this.elements.pages().contains("Candidates").click();
  }

  numberOfRecords(length: number) {
    this.elements.candidatesTable().should("have.length", length);
  }

  scheduleInterview(infoData: any) {
    this.elements.loadingSpinner().should("exist");
    this.elements.scheduleInterviewBtn().click({ force: true });
    this.elements.loadingSpinner().should("exist");
    this.elements
      .labels()
      .contains("Interview Title")
      .parents()
      .eq(1)
      .children()
      .eq(1)
      .type(`${infoData.lastName} Interview`);
    this.elements.autoCompleteInput().type(`${infoData.firstName}`);
    this.elements
      .autoCompleteOptions()
      .contains(
        `${infoData.firstName} ${infoData.middleName} ${infoData.lastName}`
      )
      .click();
    this.elements.dateInput().type("2024-04-02");
    this.elements.timeInput().clear().type("09:00 AM");
    this.elements.submitBtn().click();
    this.elements.statusLabel().should("contain", "Interview Scheduled");
  }

  addResume(filePath: string) {
    this.elements.editSwitch().click();
    this.elements.fileInput().selectFile(filePath, { force: true });
    this.elements.submitBtn().click();
    this.elements.resultToast().should("exist");
    this.elements.resumeName().should("contain", filePath.substring(filePath.lastIndexOf('/') + 1));
  }
}
