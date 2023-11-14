import moment from "moment";
import { ICreateCandidatePayload } from "../../../apis/payload/recruitment-tab/candidates-page/add-candidate-payload";
import { IScheduleInterviewPayload } from "../../../apis/payload/recruitment-tab/candidates-page/schedule-interview-payload";
import CandidatesInit from "../../../initializers/recruitment-tab/candidates-page/candidates-init";
import SharedInit from "../../../initializers/shared-init";
import PimHelper from "../../pim-tab/pim-helper";
import VacanciesHelper from "../vacancies-page/vacancies-helper";
import AdminHelper from "../../admin-tab/admin-helper";

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
  let employeeData: any = {};
  let jobData: any = {};
  let vacancyData: any = {};
  let candidateData: any = {};

  const prepare = () => {
    cy.fixture("pim-tab/employeeInfo.json")
      .then((employeeInfo: any) => {
        employeeData = employeeInfo;
        cy.fixture("admin-tab/job-page/jobTitleInfo.json");
      })
      .then((jobInfo: any) => {
        jobData = jobInfo;
        cy.fixture("recruitment-tab/vacancies-page/vacancyInfo.json");
      })
      .then((vacancyInfo: any) => {
        vacancyData = vacancyInfo;
        cy.fixture("recruitment-tab/candidates-page/candidateInfo.json");
      })
      // Add an employee
      .then((candidateInfo: any) => {
        candidateData = candidateInfo;
        PimHelper.addEmployee(employeeData);
      })
      // Add a job title
      .then((employeeResponse: any) => {
        employeeData.empNumber = employeeResponse.empNumber;
        employeeData.firstName = employeeResponse.firstName;
        AdminHelper.addJobTitle(jobData);
      })
      // Add a vacancy
      .then((jobResponse: any) => {
        vacancyData.jobTitleId = jobData.id = jobResponse.id;
        jobData.title = jobResponse.title;
        VacanciesHelper.addVacancy(vacancyData, employeeData.empNumber);
      })
      // Add a candidate
      .then((vacancyResponse: any) => {
        vacancyData.id = vacancyResponse.id;
        vacancyData.name = vacancyResponse.name;
        CandidatesHelper.addCandidate(candidateData, vacancyResponse.id);
      })
      // Shortlist a candidate
      .then((candidateResponse: any) => {
        candidateData.id = candidateResponse.id;
      });
  };

  return cy.wrap(prepare()).then(() => ({
    employeeData,
    jobData,
    vacancyData,
    candidateData,
  }));
};

export const cleanupEntities = (
  employeeNumber: any,
  jobId: any,
  vacancyId: any,
  candidateId: any
) => {
  PimHelper.deleteEmployee(employeeNumber);
  AdminHelper.deleteJobTitle(jobId);
  VacanciesHelper.deleteVacancy(vacancyId);
  CandidatesHelper.deleteCandidate(candidateId);
};

export default class CandidatesHelper {
  private static interviewId: any;
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
      .then((response: any) => response.data.map((item: any) => item.label));
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

  static rejectCandidate(candidateId: number) {
    return cy.actionOnCandidate("PUT", `${URLs.candidates}/${candidateId}/reject`);
  }

  static shortlistCandidate(candidateId: number) {
    cy.actionOnCandidate("PUT", `${URLs.candidates}/${candidateId}/shortlist`);
  }

  static scheduleInterview(candidateId: number) {
    let scheduleInterviewData: IScheduleInterviewPayload;
    cy.fixture("recruitment-tab/candidates-page/scheduleInterviewInfo.json")
      .then((scheduleInterviewInfo: any) => {
        scheduleInterviewData = {
          ...scheduleInterviewInfo,
          interviewDate: moment()
            .add(1, "day")
            .add(moment().day() % 6 === 0 ? 1 : 0, "day")
            .format("YYYY-MM-DD"),
        };
        cy.fixture("pim-tab/employeeInfo.json");
      })
      .then((interviewerData: any) => {
        PimHelper.addEmployee(interviewerData);
      })
      .then((interviewerResponse: any) => {
        scheduleInterviewData.interviewerEmpNumbers[0] =
          interviewerResponse.empNumber;
        cy.scheduleInterview(
          "POST",
          `${URLs.candidates}/${candidateId}/shedule-interview`,
          CandidatesInit.initScheduleInterview(scheduleInterviewData)
        );
      })
      .then((response: any) => {
        CandidatesHelper.interviewId = response.data.id;
      });
  }

  static markInterviewResult(
    candidateId: number,
    interviewId: any,
    result: INTERVIEW_RESULT
  ) {
    cy.actionOnCandidate(
      "PUT",
      `${
        URLs.candidates
      }/${candidateId}/interviews/${interviewId}/${result.toLowerCase()}`
    );
  }

  static jobOfferCandidate(candidateId: number, result: "offer" | "decline") {
    cy.actionOnCandidate("PUT", `${URLs.candidates}/${candidateId}/job/${result}`);
  }

  static hireCandidate(candidateId: number) {
    cy.actionOnCandidate("PUT", `${URLs.candidates}/${candidateId}/hire`);
  }

  static updateCandidateStatus(
    candidateId: number,
    currentStatus: string,
    targetStatus: string
  ): any {
    if (!CandidatesHelper.statusFlow[targetStatus]) {
      if (targetStatus === CANDIDATE_STATUS.Rejected) {
        CandidatesHelper.rejectCandidate(candidateId);
      }
      return;
    }

    cy.wrap(
      CandidatesHelper.updateCandidateStatus(
        candidateId,
        currentStatus,
        CandidatesHelper.statusFlow[targetStatus]
      )
    ).then(() => {
      switch (targetStatus) {
        case CANDIDATE_STATUS.Shortlisted:
          CandidatesHelper.shortlistCandidate(candidateId);
          break;
        case CANDIDATE_STATUS.InterviewScheduled:
          CandidatesHelper.scheduleInterview(candidateId);
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
          CandidatesHelper.jobOfferCandidate(candidateId, "offer");
          break;
        case CANDIDATE_STATUS.OfferDeclined:
          CandidatesHelper.jobOfferCandidate(candidateId, "decline");
          break;
        case CANDIDATE_STATUS.Hired:
          CandidatesHelper.hireCandidate(candidateId);
          break;
        default:
          return;
      }
    });
  }
}
