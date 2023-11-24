import SharedHelper from "../../../support/helpers/shared-helper";
import CandidatesPageActions from "../../../support/page-objects/recruitment-tab/candidates-page/candidates-page-actions";
import CandidatesPageAssertions from "../../../support/page-objects/recruitment-tab/candidates-page/candidates-page-assertions";
import CandidatesHelper, {
  CANDIDATE_STATUS,
  INTERVIEW_RESULT,
  prepareCandidate,
} from "../../../support/helpers/recruitment-tab/candidates-page/candidates-helper";
import { ICreateCandidatePayload } from "../../../support/apis/payload/recruitment-tab/candidates-page/add-candidate-payload";
import { ICreateVacancyPayload } from "../../../support/apis/payload/recruitment-tab/vacancies-page/add-vacancy-payload";
import { ICreateJobTitlePayload } from "../../../support/apis/payload/admin-tab/job-page/add-jobTitle-payload";
import { ICreateEmployeePayload } from "../../../support/apis/payload/pim-tab/add-employee-payload";
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
  candidateId: number;

describe("Recruitment: Candidates functionality", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();
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

  [INTERVIEW_RESULT.Pass, INTERVIEW_RESULT.Fail].forEach(
    (interviewResult: INTERVIEW_RESULT) => {
      it(`Candidates - The user should be able to mark the interview result as ${interviewResult}`, () => {
        candidatesPageActions.openCandidatesPage();
        CandidatesHelper.updateCandidateVacancyStatus(
          candidateId,
          CANDIDATE_STATUS.ApplicationInitiated,
          CANDIDATE_STATUS.InterviewScheduled
        );
        candidatesPageActions.editCandidateById(candidateId);
        SharedHelper.waitUntilItFinished();
        candidatesPageActions.markInterviewResult(interviewResult);
        SharedHelper.checkToastMessage("Successfully Updated");
        candidatesPageAssertions.checkStatus(interviewResult);
        CandidatesHelper.getAllowedActions(candidateId).then((buttons: any) => {
          buttons.forEach((buttonName: string) => {
            candidatesPageAssertions.checkButtonIsAvailable(buttonName);
          });
        });
      });
    }
  );

  [CANDIDATE_STATUS.ApplicationInitiated, CANDIDATE_STATUS.Hired].forEach(
    (candidateStatus: string) => {
      it(`Candidates - The user should be able to upload a Resume (txt file) for the ${candidateStatus} status`, () => {
        candidatesPageActions.openCandidatesPage();
        CandidatesHelper.updateCandidateVacancyStatus(
          candidateId,
          CANDIDATE_STATUS.ApplicationInitiated,
          candidateStatus
        );
        candidatesPageActions.editCandidateById(candidateId);
        const resumePath =
          "cypress/fixtures/recruitment-tab/candidates-page/candidateResume.txt";
        const resumeName = resumePath.split("/").pop()!;
        candidatesPageActions.addResume(resumePath);
        SharedHelper.checkToastMessage("Successfully Updated");
        candidatesPageActions.downloadResume();
        SharedHelper.verifyDownloadedFileContents(resumeName, resumePath);
      });
    }
  );

  afterEach(() => {
    PimHelper.deleteEmployee(empNumber);
    AdminHelper.deleteJobTitle(jobId);
    VacanciesHelper.deleteVacancy(vacancyId);
    CandidatesHelper.deleteCandidate(candidateId);
  });
});
