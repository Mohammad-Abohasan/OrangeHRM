import SharedHelper from "../../../helpers/shared-helper";

class VacanciesPageActions {
  elements = {
    addAttachmentBtn: () =>
      cy.get(".orangehrm-attachment-header > button[type='button']"),
    fileInput: () => cy.get("input[type='file']"),
    saveBtn: () => cy.get("button[type='submit']"),
    downloadBtn: () => cy.get(".bi-download"),
  };

  openVacanciesPage() {
    SharedHelper.mainMenuItems().contains("Recruitment").click();
    SharedHelper.topBarItems().contains("Vacancies").click();
  }

  editVacancyById(vacancyId: number) {
    cy.visit(`/web/index.php/recruitment/addJobVacancy/${vacancyId}`);
  }

  addAttachmentToVacancy(filePath: string) {
    this.elements.addAttachmentBtn().click();
    this.elements.fileInput().selectFile(filePath, { force: true });
    this.elements.saveBtn().eq(1).click();
  }

  downloadAnAttachment() {
    this.elements.downloadBtn().eq(0).click();
  }
}
export default VacanciesPageActions;
