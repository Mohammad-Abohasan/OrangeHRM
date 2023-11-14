import SharedHelper from "../../../support/helpers/shared-helper";
import CandidatesPageActions from "../../../support/page-objects/recruitment-tab/candidates-page/candidates-page-actions";
import CandidatesPageAssertions from "../../../support/page-objects/recruitment-tab/candidates-page/candidates-page-assertions";
import CandidatesHelper, {
  CANDIDATE_STATUS,
  INTERVIEW_RESULT,
  cleanupEntities,
  prepareCandidate,
} from "../../../support/helpers/recruitment-tab/candidates-page/candidates-helper";

const candidatesPageActions: CandidatesPageActions = new CandidatesPageActions();
const candidatesPageAssertions: CandidatesPageAssertions =
  new CandidatesPageAssertions();

let employeeData: any = {};
let jobData: any = {};
let vacancyData: any = {};
let candidateData: any = {};

describe("Recruitment: Candidates functionality", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();
    prepareCandidate().then((preparedData: any) => {
      employeeData = preparedData.employeeData;
      jobData = preparedData.jobData;
      vacancyData = preparedData.vacancyData;
      candidateData = preparedData.candidateData;
    });
  });

  [INTERVIEW_RESULT.Pass, INTERVIEW_RESULT.Fail].forEach(
    (interviewResult: INTERVIEW_RESULT) => {
      it(`Candidates - The user should be able to mark the interview result as ${interviewResult}`, () => {
        candidatesPageActions.openCandidatesPage();
        CandidatesHelper.updateCandidateStatus(
          candidateData.id,
          CANDIDATE_STATUS.ApplicationInitiated,
          CANDIDATE_STATUS.InterviewScheduled
        );
        candidatesPageActions.editCandidateById(candidateData.id);
        SharedHelper.checkLoadingSpinnerIsExist(false);
        candidatesPageActions.markInterviewResult(interviewResult);
        SharedHelper.checkToastMessage("Successfully Updated");
        candidatesPageAssertions.checkStatus(interviewResult);
        CandidatesHelper.getAllowedActions(candidateData.id).then((buttons: any) => {
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
        CandidatesHelper.updateCandidateStatus(
          candidateData.id,
          CANDIDATE_STATUS.ApplicationInitiated,
          candidateStatus
        );
        candidatesPageActions.editCandidateById(candidateData.id);
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
    cleanupEntities(
      employeeData.empNumber,
      jobData.id,
      vacancyData.id,
      candidateData.id
    );
  });
});
