export default class VacanciesPage {
  elements = {
    pages: () => cy.get(".oxd-topbar-body-nav-tab"),
    addAttachmentBtn: () =>
      cy.get(".orangehrm-attachment-header > button[type='button']"),
    fileInput: () => cy.get("input[type='file']"),
    saveBtn: () => cy.get("button[type='submit']"),
    attachmentsTableData: () => cy.get(".oxd-table-card > .oxd-table-row"), // TODO: Edit this selector
    resultToast: () => cy.get(".oxd-toast")
  };

  openCandidatesPage() {
    this.elements.pages().contains("Vacancies").click();
  }

  addAttachment(filePath: string) {
    this.elements.addAttachmentBtn().click();
    this.elements.fileInput().selectFile(filePath, { force: true });
    this.elements.saveBtn().eq(1).click();

    // this.elements.resultToast().should("exist");
    // this.elements.attachmentsTableData().should("contain", filePath.substring(filePath.lastIndexOf('/') + 1));
  }
}
