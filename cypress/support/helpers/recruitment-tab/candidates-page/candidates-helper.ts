import moment from "moment";
import { ICreateCandidatePayload } from "../../../apis/payload/recruitment-tab/candidates-page/add-candidate-payload";
import { IScheduleInterviewPayload } from "../../../apis/payload/recruitment-tab/candidates-page/schedule-interview-payload";
import CandidatesInit from "../../../initializers/recruitment-tab/candidates-page/candidates-init";
import SharedInit from "../../../initializers/shared-init";
import PimHelper from "../../pim-tab/pim-helper";
import VacanciesHelper from "../vacancies-page/vacancies-helper";
import AdminHelper from "../../admin-tab/admin-helper";
import { ICreateEmployeePayload } from "../../../apis/payload/pim-tab/add-employee-payload";
import { ICreateJobTitlePayload } from "../../../apis/payload/admin-tab/job-page/add-jobTitle-payload";
import { ICreateVacancyPayload } from "../../../apis/payload/recruitment-tab/vacancies-page/add-vacancy-payload";
import { ICreateEmployeeResponse } from "../../../apis/response/pim-tab/add-employee-response";
import { ICreateJobTitleResponse } from "../../../apis/response/admin-tab/job-page/add-jobTitle-response";
import { ICreateVacancyResponse } from "../../../apis/response/recruitment-tab/vacancies-page/add-vacancy-response";
import { ICreateCandidateResponse } from "../../../apis/response/recruitment-tab/candidates-page/add-candidate-response";
import { IScheduleInterviewResponse } from "../../../apis/response/recruitment-tab/candidates-page/schedule-interview-response";
import { IGetAllowedActions } from "../../../apis/response/recruitment-tab/candidates-page/allowedActions";

export enum CANDIDATE_STATUS {
  ApplicationInitiated = "Application Initiated",
  Shortlisted = "Shortlisted",
  InterviewScheduled = "Interview Scheduled",
  InterviewPassed = "Interview Passed",
  InterviewFailed = "Interview Failed",
  JobOffered = "Job Offered",
  OfferDeclined = "Offer Declined",
  Hired = "Hired",
  Rejected = "Rejected",
}

export enum INTERVIEW_RESULT {
  Pass = "Pass",
  Fail = "Fail",
}

export const URLs = {
  candidatesData: `/web/index.php/api/v2/recruitment/candidates?limit=50`,
  candidates: `/web/index.php/api/v2/recruitment/candidates`,
};

export const prepareCandidate = () => {
  let employeeData: ICreateEmployeePayload,
    jobData: ICreateJobTitlePayload,
    vacancyData: ICreateVacancyPayload,
    candidateData: ICreateCandidatePayload,
    empNumber: number,
    jobId: number,
    vacancyId: number,
    candidateId: number;

  const prepare = () => {
    cy.fixture("pim-tab/employeeInfo.json")
      .then((employeeInfo: ICreateEmployeePayload) => {
        employeeData = employeeInfo;
        cy.fixture("admin-tab/job-page/jobTitleInfo.json");
      })
      .then((jobInfo: ICreateJobTitlePayload) => {
        jobData = jobInfo;
        cy.fixture("recruitment-tab/vacancies-page/vacancyInfo.json");
      })
      .then((vacancyInfo: ICreateVacancyPayload) => {
        vacancyData = vacancyInfo;
        cy.fixture("recruitment-tab/candidates-page/candidateInfo.json");
      })
      // Add an employee
      .then((candidateInfo: ICreateCandidatePayload) => {
        candidateData = candidateInfo;
        PimHelper.addEmployee(employeeData);
      })
      // Add a job title
      .then((employeeResponse: ICreateEmployeeResponse["data"]) => {
        empNumber = employeeResponse.empNumber;
        employeeData.firstName = employeeResponse.firstName;
        AdminHelper.addJobTitle(jobData);
      })
      // Add a vacancy
      .then((jobResponse: ICreateJobTitleResponse["data"]) => {
        vacancyData.jobTitleId = jobId = jobResponse.id;
        jobData.title = jobResponse.title;
        VacanciesHelper.addVacancy(vacancyData, empNumber);
      })
      // Add a candidate
      .then((vacancyResponse: ICreateVacancyResponse["data"]) => {
        vacancyId = vacancyResponse.id;
        CandidatesHelper.addCandidate(candidateData, vacancyResponse.id);
      })
      .then((candidateResponse: ICreateCandidateResponse["data"]) => {
        candidateId = candidateResponse.id;
      });
  };

  return cy.wrap(prepare()).then(() => ({
    employeeData,
    jobData,
    vacancyData,
    candidateData,
    empNumber,
    jobId,
    vacancyId,
    candidateId,
  }));
};

export default class CandidatesHelper {
  private static interviewId: number;
  private static statusFlow: { [key: string]: string } = {
    [CANDIDATE_STATUS.ApplicationInitiated]: "",
    [CANDIDATE_STATUS.Rejected]: "",
    [CANDIDATE_STATUS.Shortlisted]: CANDIDATE_STATUS.ApplicationInitiated,
    [CANDIDATE_STATUS.InterviewScheduled]: CANDIDATE_STATUS.Shortlisted,
    [CANDIDATE_STATUS.InterviewPassed]: CANDIDATE_STATUS.InterviewScheduled,
    [CANDIDATE_STATUS.InterviewFailed]: CANDIDATE_STATUS.InterviewScheduled,
    [CANDIDATE_STATUS.JobOffered]: CANDIDATE_STATUS.InterviewPassed,
    [CANDIDATE_STATUS.OfferDeclined]: CANDIDATE_STATUS.JobOffered,
    [CANDIDATE_STATUS.Hired]: CANDIDATE_STATUS.JobOffered,
  };

  static getAllowedActions(candidateId: number) {
    return cy
      .getAllowedActions("GET", `${URLs.candidates}/${candidateId}/actions/allowed`)
      .then((response: IGetAllowedActions) =>
        response.data.map((item) => item.label)
      );
  }

  static getCandidatesTableDataUsingAPI() {
    return cy.getCandidatesTableData("GET", URLs.candidatesData);
  }

  static addCandidate(candidateData: ICreateCandidatePayload, vacancyId: number) {
    return cy
      .addCandidate(
        "POST",
        URLs.candidates,
        CandidatesInit.initCandidate(candidateData, vacancyId)
      )
      .then((response) => response.data);
  }

  static deleteCandidate(candidateId: number) {
    return cy.deleteItem(
      "DELETE",
      URLs.candidates,
      SharedInit.initDeleteItem(candidateId)
    );
  }

  static setCandidateVacancyRejectStatus(candidateId: number) {
    return cy.actionOnCandidate("PUT", `${URLs.candidates}/${candidateId}/reject`);
  }

  static setCandidateVacancyShortlistStatus(candidateId: number) {
    cy.actionOnCandidate("PUT", `${URLs.candidates}/${candidateId}/shortlist`);
  }

  static setCandidateVacancyScheduleInterviewStatus(candidateId: number) {
    let scheduleInterviewData: IScheduleInterviewPayload;
    cy.fixture("recruitment-tab/candidates-page/scheduleInterviewInfo.json")
      .then((scheduleInterviewInfo: IScheduleInterviewPayload) => {
        scheduleInterviewData = {
          ...scheduleInterviewInfo,
          interviewDate: moment()
            .add(1, "day")
            .add(moment().day() % 6 === 0 ? 1 : 0, "day")
            .format("YYYY-MM-DD"),
        };
        cy.fixture("pim-tab/employeeInfo.json");
      })
      .then((interviewerData: ICreateEmployeePayload) => {
        PimHelper.addEmployee(interviewerData);
      })
      .then((interviewerResponse: ICreateEmployeeResponse["data"]) => {
        scheduleInterviewData.interviewerEmpNumbers[0] =
          interviewerResponse.empNumber;
        cy.scheduleInterview(
          "POST",
          `${URLs.candidates}/${candidateId}/shedule-interview`,
          CandidatesInit.initScheduleInterview(scheduleInterviewData)
        );
      })
      .then((response: IScheduleInterviewResponse) => {
        CandidatesHelper.interviewId = response.data.id;
      });
  }

  static markInterviewResult(
    candidateId: number,
    interviewId: number,
    result: INTERVIEW_RESULT
  ) {
    cy.actionOnCandidate(
      "PUT",
      `${
        URLs.candidates
      }/${candidateId}/interviews/${interviewId}/${result.toLowerCase()}`
    );
  }

  static setCandidateVacancyJobStatus(
    candidateId: number,
    result: "offer" | "decline"
  ) {
    cy.actionOnCandidate("PUT", `${URLs.candidates}/${candidateId}/job/${result}`);
  }

  static setCandidateVacancyHireCandidateStatus(candidateId: number) {
    cy.actionOnCandidate("PUT", `${URLs.candidates}/${candidateId}/hire`);
  }

  static updateCandidateVacancyStatus(
    candidateId: number,
    currentStatus: string,
    targetStatus: string
  ) {
    if (!CandidatesHelper.statusFlow[targetStatus]) {
      if (targetStatus === CANDIDATE_STATUS.Rejected) {
        CandidatesHelper.setCandidateVacancyRejectStatus(candidateId);
      }
      return;
    }

    cy.wrap(
      CandidatesHelper.updateCandidateVacancyStatus(
        candidateId,
        currentStatus,
        CandidatesHelper.statusFlow[targetStatus]
      )
    ).then(() => {
      switch (targetStatus) {
        case CANDIDATE_STATUS.Shortlisted:
          CandidatesHelper.setCandidateVacancyShortlistStatus(candidateId);
          break;
        case CANDIDATE_STATUS.InterviewScheduled:
          CandidatesHelper.setCandidateVacancyScheduleInterviewStatus(candidateId);
          break;
        case CANDIDATE_STATUS.InterviewPassed:
          CandidatesHelper.markInterviewResult(
            candidateId,
            CandidatesHelper.interviewId,
            INTERVIEW_RESULT.Pass
          );
          break;
        case CANDIDATE_STATUS.InterviewFailed:
          CandidatesHelper.markInterviewResult(
            candidateId,
            CandidatesHelper.interviewId,
            INTERVIEW_RESULT.Fail
          );
          break;
        case CANDIDATE_STATUS.JobOffered:
          CandidatesHelper.setCandidateVacancyJobStatus(candidateId, "offer");
          break;
        case CANDIDATE_STATUS.OfferDeclined:
          CandidatesHelper.setCandidateVacancyJobStatus(candidateId, "decline");
          break;
        case CANDIDATE_STATUS.Hired:
          CandidatesHelper.setCandidateVacancyHireCandidateStatus(candidateId);
          break;
        default:
          return;
      }
    });
  }
}
