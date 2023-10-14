export default class CandidatesPage {
  elements = {
    mainMenuItems: () => cy.get(".oxd-sidepanel-body"),
    pages: () => cy.get(".oxd-topbar-body-nav-tab"),
    candidatesTable: () => cy.get(".oxd-table-body > .oxd-table-card"),
  };

  openCandidatesPage() {
    this.elements.mainMenuItems().contains("Recruitment").click();
    this.elements.pages().contains("Candidates").click();
  }

  checkNumberOfRecords(length: number) {
    this.elements.candidatesTable().should("have.length", length);
  }
}
