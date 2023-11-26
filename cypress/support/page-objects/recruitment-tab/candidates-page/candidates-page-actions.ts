import { INTERVIEW_RESULT } from "../../../helpers/recruitment-tab/candidates-page/candidates-helper";
import SharedHelper from "../../../helpers/shared-helper";
import CandidatesPageAssertions from "./candidates-page-assertions";

const candidatesPageAssertions: CandidatesPageAssertions =
  new CandidatesPageAssertions();

export default class CandidatesPageActions {
  elements = {
    getButtonByName: (buttonName: string) =>
      cy
        .get(".orangehrm-card-container")
        .contains("[type=button]", ` ${buttonName} `),
    labels: () => cy.get(".oxd-label"),
    autoCompleteInput: () => cy.get(".oxd-autocomplete-text-input > input"),
    autoCompleteOptions: () => cy.get(".oxd-autocomplete-option"),
    dateInput: () => cy.get(".oxd-date-input"),
    timeInput: () => cy.get(".oxd-time-input"),

    editSwitch: () => cy.get(".oxd-switch-input"),
    fileInput: () => cy.get("input[type='file']"),
    resumeName: () => cy.get(".orangehrm-file-preview > .oxd-text"),
    downloadResumeButton: () => cy.get(".bi-download"),
  };

  openCandidatesPage() {
    cy.intercept("/web/index.php/core/i18n/messages").as("messages");
    cy.intercept("/web/index.php/api/v2/admin/job-titles**").as("jobTitles");
    cy.intercept("/web/index.php/api/v2/recruitment/vacancies**").as("vacancies");
    cy.intercept("/web/index.php/api/v2/recruitment/hiring-managers**").as(
      "hiringManagers"
    );
    cy.intercept("/web/index.php/api/v2/recruitment/candidates/statuses**").as(
      "candidates-statuses"
    );
    cy.intercept("/web/index.php/api/v2/leave/workweek**").as("workweek");
    cy.intercept("/web/index.php/api/v2/leave/holidays**").as("holidays");

    SharedHelper.mainMenuItems().contains("Recruitment").click();
    SharedHelper.topBarItems().contains("Candidates").click();

    cy.wait([
      "@messages",
      "@jobTitles",
      "@vacancies",
      "@hiringManagers",
      "@candidates-statuses",
      "@workweek",
      "@holidays",
    ]);
  }

  searchForCandidate(candidateData: any) {
    const [firstNameHM, , lastNameHM] = candidateData["Hiring Manager"].split(" ");
    const [firstNameCandidate] = candidateData["Candidate"].split(" ");
    SharedHelper.fillInInputField("Vacancy", candidateData["Vacancy"]);
    SharedHelper.fillInInputField("Hiring Manager", `${firstNameHM} ${lastNameHM}`);
    SharedHelper.fillInInputField("Candidate Status", candidateData["Status"]);
    SharedHelper.fillInInputField("Candidate Name", firstNameCandidate);
    SharedHelper.fillInInputField(
      "Date of Application",
      candidateData["Date of Application"]
    );
    SharedHelper.clickSubmitButtonIsContains("Search");
  }

  scheduleInterview(interviewData: any, interviewerData: any) {
    this.elements.getButtonByName("Schedule Interview").click({ force: true });
    SharedHelper.waitUntilItFinished();
    SharedHelper.fillInInputField("Interview Title", interviewData.interviewName);
    SharedHelper.fillInInputField(
      "Interviewer",
      `${interviewerData.firstName} ${interviewerData.middleName} ${interviewerData.lastName}`
    );
    SharedHelper.fillInInputField("Date", interviewData.date);
    SharedHelper.fillInInputField("Time", interviewData.time);
    SharedHelper.clickSubmitButtonIsContains("Save");
  }

  editCandidateById(candidateId: number) {
    cy.visit(`/web/index.php/recruitment/addCandidate/${candidateId}`);
  }

  addResume(filePath: string) {
    this.elements.editSwitch().click();
    this.elements.fileInput().selectFile(filePath, { force: true });
    SharedHelper.clickSubmitButtonIsContains("Save");
  }

  downloadResume() {
    this.elements.downloadResumeButton().click();
  }

  markInterviewResult(result: INTERVIEW_RESULT) {
    this.elements.getButtonByName(`Mark Interview ${result}ed`).click();
    SharedHelper.waitUntilItFinished();
    SharedHelper.waitUntilItFinished();
    SharedHelper.clickSubmitButtonIsContains("Save");
  }
}
