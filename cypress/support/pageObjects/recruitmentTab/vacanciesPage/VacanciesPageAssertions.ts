import SharedHelper from "../../../helpers/SharedHelper";

class VacanciesPageAssertions {
  elements = {
    tableRows: () => cy.get(".oxd-table-card > .oxd-table-row"),
    downloadBtn: () => cy.get(".bi-download"),
  };

  checkRecordsContainsAttachment(attachmentData: any) {
    SharedHelper.checkLoadingSpinnerIsExist(false);
    this.elements.tableRows().should("exist");
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "File Name",
      attachmentData["File Name"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "File Size",
      attachmentData["File Size"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "File Type",
      attachmentData["File Type"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Comment",
      attachmentData["Comment"]
    );
  }

  checkRecordsContainsVacancy(vacancyData: any) {
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Vacancy",
      vacancyData["Vacancy"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Job Title",
      vacancyData["Job Title"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Hiring Manager",
      vacancyData["Hiring Manager"]
    );
    SharedHelper.checkRecordsContainsValueInColumn(
      0,
      "Status",
      vacancyData["Status"]
    );
  }
}
export default VacanciesPageAssertions;
