import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import CandidatesHelper, {
  CANDIDATE_STATUS,
  INTERVIEW_RESULT,
  cleanupEntities,
  prepareCandidate,
} from "../../../support/helpers/recruitment-tab/candidates-page/candidates-helper";
import CandidatesPageActions from "../../../support/page-objects/recruitment-tab/candidates-page/candidates-page-actions";
import CandidatesPageAssertions from "../../../support/page-objects/recruitment-tab/candidates-page/candidates-page-assertions";
import SharedHelper from "../../../support/helpers/shared-helper";

const candidatesPageActions: CandidatesPageActions = new CandidatesPageActions();
const candidatesPageAssertions: CandidatesPageAssertions =
  new CandidatesPageAssertions();

let employeeData: any = {};
let jobData: any = {};
let vacancyData: any = {};
let candidateData: any = {};
let resumePath = "";

Given("Login as Admin", () => {
  cy.loginOrangeHRM();
});

Given("Prepare Candidate data with Application Initiated status", () => {
  prepareCandidate().then((preparedData: any) => {
    employeeData = preparedData.employeeData;
    jobData = preparedData.jobData;
    vacancyData = preparedData.vacancyData;
    candidateData = preparedData.candidateData;
  });
});

Given("The user open Candidates page", () => {
  candidatesPageActions.openCandidatesPage();
});

Given("The user change candidate status to {string}", (target) => {
  CandidatesHelper.updateCandidateStatus(
    candidateData.id,
    CANDIDATE_STATUS.ApplicationInitiated,
    CANDIDATE_STATUS[target as keyof typeof CANDIDATE_STATUS]
  );
});

Given("The user open edit candidate page", () => {
  candidatesPageActions.editCandidateById(candidateData.id);
  SharedHelper.checkLoadingSpinnerIsExist(false);
});

When("The user mark interview result as {string}", (result) => {
  candidatesPageActions.markInterviewResult(
    INTERVIEW_RESULT[result as keyof typeof INTERVIEW_RESULT]
  );
  SharedHelper.checkToastMessage("Successfully Updated");
});

Then(`The candidate status should be changed to Interview {string}`, (status) => {
  candidatesPageAssertions.checkStatus(`Interview ${status}`);
});

Then("The user should be able to see all available buttons", () => {
  CandidatesHelper.getAllowedActions(candidateData.id).then((buttons: any) => {
    buttons.forEach((buttonName: string) => {
      candidatesPageAssertions.checkButtonIsAvailable(buttonName);
    });
  });
});

When("The user should be able to upload a Resume - txt file", () => {
  resumePath =
    "cypress/fixtures/recruitment-tab/candidates-page/candidateResume.txt";
  candidatesPageActions.addResume(resumePath);
  SharedHelper.checkToastMessage("Successfully Updated");
});

Then("The user should be able to download uploaded Resume", () => {
  candidatesPageActions.downloadResume();
});

Then("The user should see the same content as in the uploaded Resume", () => {
  const resumeName = resumePath.split("/").pop()!;
  SharedHelper.verifyDownloadedFileContents(resumeName, resumePath);
});

afterEach(() => {
  cleanupEntities(
    employeeData.empNumber,
    jobData.id,
    vacancyData.id,
    candidateData.id
  );
});
