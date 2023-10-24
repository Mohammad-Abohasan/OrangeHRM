export default class VacanciesPage {
  elements = {
    pages: () => cy.get(".oxd-topbar-body-nav-tab"),
    addAttachmentBtn: () =>
      cy.get(".orangehrm-attachment-header > button[type='button']"),
    fileInput: () => cy.get("input[type='file']"),
    saveBtn: () => cy.get("button[type='submit']"),
    tableRows: () => cy.get(".oxd-table-card > .oxd-table-row"),
    resultToast: () => cy.get(".oxd-toast"),
    tableLoader: () => cy.get(".oxd-table > .oxd-table-loader"),
    downloadBtn: () => cy.get(".bi-download"),
  };

  openCandidatesPage() {
    this.elements.pages().contains("Vacancies").click();
  }

  addAttachment(filePath: string) {
    this.elements.addAttachmentBtn().click();
    this.elements.fileInput().selectFile(filePath, { force: true });
    this.elements.saveBtn().eq(1).click();
  }

  downloadAttachment() {
    this.elements.tableLoader().should("not.exist");
    this.elements.tableRows().should("exist");
    this.elements.downloadBtn().click();
  }
}
