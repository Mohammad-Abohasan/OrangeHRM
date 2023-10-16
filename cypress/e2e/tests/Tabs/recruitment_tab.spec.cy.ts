import LoginPage from "../../../support/pageObjects/LoginPage";
import CandidatesPage from "../../../support/pageObjects/RecruitmentTab/CandidatesPage";
import VacanciesPage from "../../../support/pageObjects/RecruitmentTab/VacanciesPage";
import vacanciesHelper from "../../../support/helpers/vacanciesHelper";
import candidatesHelper from "../../../support/helpers/candidatesHelper";
import pimHelper from "../../../support/helpers/pimHelper";
import adminHelper from "../../../support/helpers/adminHelper";

const loginPage: LoginPage = new LoginPage();
const candidatesPage: CandidatesPage = new CandidatesPage();
const vacanciesPage: VacanciesPage = new VacanciesPage();

let employeeData: any = {};

describe("Recruitment: Candidates & Vacancies table data validation", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.fixture("loginInfo").then((loginData: any) => {
      loginPage.login(loginData.userName.valid, loginData.password.valid);
    });

    cy.fixture("employeeInfo").then((empData) => {
      employeeData = empData;
    });
  });

  it("Recruitment - Candidates: verify number of records", () => {
    candidatesPage.openCandidatesPage();
    candidatesHelper
      .getCandidatesTableDataUsingAPI()
      .as("Candidates Page")
      .then((response: any) => {
        candidatesPage.numberOfRecords(response.meta.total);
      });
  });

  it("Recruitment - Schedule an Interview for a Candidate", () => {
    pimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Add a vacancy
      .then((employeeResponse) => {
        return cy.fixture("vacancyInfo").then((vacancyData) => {
          return vacanciesHelper.addVacancy(
            vacancyData,
            employeeResponse.data.empNumber
          );
        });
      })
      // Add a candidate
      .then((vacancyResponse) => {
        return cy.fixture("candidateInfo").then((candidateData) => {
          return candidatesHelper.addCandidate(
            candidateData,
            vacancyResponse.data.id
          );
        });
      })
      // Shortlist the candidate and schedule an interview
      .then((candidateResponse) => {
        candidatesHelper.shortlistCandidate(candidateResponse.data.id);
        candidatesPage.scheduleInterview(
          candidateResponse.data.id,
          employeeData
        );
      })
      // Delete the employee after the test
      .then(() => {
        return pimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        pimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
      });
  });
});
