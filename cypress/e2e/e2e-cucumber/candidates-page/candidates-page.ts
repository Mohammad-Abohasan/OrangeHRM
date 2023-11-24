import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import CandidatesHelper, {
  CANDIDATE_STATUS,
  INTERVIEW_RESULT,
  prepareCandidate,
} from "../../../support/helpers/recruitment-tab/candidates-page/candidates-helper";
import CandidatesPageActions from "../../../support/page-objects/recruitment-tab/candidates-page/candidates-page-actions";
import CandidatesPageAssertions from "../../../support/page-objects/recruitment-tab/candidates-page/candidates-page-assertions";
import SharedHelper from "../../../support/helpers/shared-helper";
import { ICreateEmployeePayload } from "../../../support/apis/payload/pim-tab/add-employee-payload";
import { ICreateJobTitlePayload } from "../../../support/apis/payload/admin-tab/job-page/add-jobTitle-payload";
import { ICreateVacancyPayload } from "../../../support/apis/payload/recruitment-tab/vacancies-page/add-vacancy-payload";
import { ICreateCandidatePayload } from "../../../support/apis/payload/recruitment-tab/candidates-page/add-candidate-payload";
import PimHelper from "../../../support/helpers/pim-tab/pim-helper";
import AdminHelper from "../../../support/helpers/admin-tab/admin-helper";
import VacanciesHelper from "../../../support/helpers/recruitment-tab/vacancies-page/vacancies-helper";

const candidatesPageActions: CandidatesPageActions = new CandidatesPageActions();
const candidatesPageAssertions: CandidatesPageAssertions =
  new CandidatesPageAssertions();

let employeeData: ICreateEmployeePayload,
  jobData: ICreateJobTitlePayload,
  vacancyData: ICreateVacancyPayload,
  candidateData: ICreateCandidatePayload,
  empNumber: number,
  jobId: number,
  vacancyId: number,
  candidateId: number,
  resumePath: string = "";

Given("Login as Admin", () => {
  cy.loginOrangeHRM();
});

Given("Prepare Candidate data with Application Initiated status", () => {
  prepareCandidate().then((preparedData) => {
    ({
      employeeData,
      jobData,
      vacancyData,
      candidateData,
      empNumber,
      jobId,
      vacancyId,
      candidateId,
    } = preparedData);
  });
});

Given("The user open Candidates page", () => {
  candidatesPageActions.openCandidatesPage();
});

Given("The user change candidate status to {string}", (target: string) => {
  CandidatesHelper.updateCandidateVacancyStatus(
    candidateId,
    CANDIDATE_STATUS.ApplicationInitiated,
    CANDIDATE_STATUS[target as keyof typeof CANDIDATE_STATUS]
  );
});

Given("The user open edit candidate page", () => {
  candidatesPageActions.editCandidateById(candidateId);
  SharedHelper.waitUntilItFinished();
});

When("The user mark interview result as {string}", (result: string) => {
  candidatesPageActions.markInterviewResult(
    INTERVIEW_RESULT[result as keyof typeof INTERVIEW_RESULT]
  );
  SharedHelper.checkToastMessage("Successfully Updated");
});

Then(
  `The candidate status should be changed to Interview {string}`,
  (status: string) => {
    candidatesPageAssertions.checkStatus(`Interview ${status}`);
  }
);

Then("The user should be able to see all available buttons", () => {
  CandidatesHelper.getAllowedActions(candidateId).then((buttons: string[]) => {
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
  PimHelper.deleteEmployee(empNumber);
  AdminHelper.deleteJobTitle(jobId);
  VacanciesHelper.deleteVacancy(vacancyId);
  CandidatesHelper.deleteCandidate(candidateId);
});
