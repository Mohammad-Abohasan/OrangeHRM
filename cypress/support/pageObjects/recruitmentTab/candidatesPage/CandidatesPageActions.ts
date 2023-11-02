import SharedHelper from "../../../helpers/SharedHelper";
import CandidatesPageAssertions from "./CandidatesPageAssertions";

const candidatesPageAssertions: CandidatesPageAssertions =
  new CandidatesPageAssertions();

export default class CandidatesPageActions {
  elements = {
    pages: () => cy.get(".oxd-topbar-body-nav-tab"),
    loadingSpinner: () => cy.get(".oxd-loading-spinner-container"),
    scheduleInterviewBtn: () => cy.get(".oxd-button--success"),
    labels: () => cy.get(".oxd-label"),
    autoCompleteInput: () => cy.get(".oxd-autocomplete-text-input > input"),
    autoCompleteOptions: () => cy.get(".oxd-autocomplete-option"),
    dateInput: () => cy.get(".oxd-date-input"),
    timeInput: () => cy.get(".oxd-time-input"),
    submitBtn: () => cy.get('button[type="submit"]'),

    editSwitch: () => cy.get(".oxd-switch-input"),
    fileInput: () => cy.get("input[type='file']"),
    resumeName: () => cy.get(".orangehrm-file-preview > .oxd-text"),
  };

  openCandidatesPage() {
    SharedHelper.mainMenuItems().contains("Recruitment").click();
    this.elements.pages().contains("Candidates").click();
  }

  searchForCandidate(candidateData: any) {
    const [firstNameHM, , lastNameHM] =
      candidateData["Hiring Manager"].split(" ");
    const [firstNameCandidate] = candidateData["Candidate"].split(" ");
    SharedHelper.selectItemFromDropdown("Vacancy", candidateData["Vacancy"]);
    SharedHelper.selectItemFromDropdown(
      "Hiring Manager",
      `${firstNameHM} ${lastNameHM}`
    );
    SharedHelper.selectItemFromDropdown("Status", candidateData["Status"]);
    SharedHelper.selectOptionFromListBox("Candidate Name", firstNameCandidate);
    SharedHelper.selectDateFromCalendar(
      "Date of Application",
      candidateData["Date of Application"]
    );
    SharedHelper.clickSubmitButtonIsContains("Search");
  }

  scheduleInterview(infoData: any) {
    SharedHelper.checkLoadingSpinnerIsExist(true);
    this.elements.scheduleInterviewBtn().click({ force: true });
    SharedHelper.checkLoadingSpinnerIsExist(true);
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
  }

  editCandidateById(candidateId: number) {
    cy.visit(`/web/index.php/recruitment/addCandidate/${candidateId}`);
  }

  addResume(filePath: string) {
    this.elements.editSwitch().click();
    this.elements.fileInput().selectFile(filePath, { force: true });
    this.elements.submitBtn().click();
  }
}
