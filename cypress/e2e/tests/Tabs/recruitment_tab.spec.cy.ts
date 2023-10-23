import LoginPage from "../../../support/pageObjects/LoginPage";
import CandidatesPage from "../../../support/pageObjects/RecruitmentTab/CandidatesPage";
import VacanciesPage from "../../../support/pageObjects/RecruitmentTab/VacanciesPage";
import vacanciesHelper from "../../../support/helpers/vacanciesHelper";
import candidatesHelper from "../../../support/helpers/candidatesHelper";
import pimHelper from "../../../support/helpers/pimHelper";
import commonHelper from "../../../support/helpers/commonHelper";

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

  it("Recruitment - Candidates: Attach Resume File", () => {
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
      // Verify the candidate record
      .then((candidateResponse) => {
        cy.visit(
          `/web/index.php/recruitment/addCandidate/${candidateResponse.data.id}`
        );
        candidatesPage.addResume("cypress/fixtures/CandidateResume.docx");
      })
      // Delete the employee after the test
      .then(() => {
        return pimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        pimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
      });
  });

  it("Recruitment - Vacancies: The user should be able to attach a file to a vacancy.", () => {
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
        cy.visit(
          `/web/index.php/recruitment/addJobVacancy/${vacancyResponse.data.id}`
        );
        vacanciesPage.addAttachment("cypress/fixtures/VacancyAttachment.xlsx");
        cy.get(".oxd-toast").should("exist");
        commonHelper.checkRows(".oxd-table-row", [
          {
            "File Name": "VacancyAttachment.xlsx",
            "File Size": "9.06 kb",
            "File Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            Comment: "",
          },
        ]);
      })
      // Delete the employee after the test
      .then(() => {
        return pimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        pimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
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

  it("Recruitment - Candidates: Schedule an Interview for a Candidate", () => {
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
        cy.visit(
          `/web/index.php/recruitment/addCandidate/${candidateResponse.data.id}`
        );
        candidatesPage.scheduleInterview(employeeData);
      })
      // Delete the employee after the test
      .then(() => {
        return pimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        pimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
      });
  });

  it("Recruitment - Candidates: Add a new candidate and verify the record" /*{ retries: 2 },*/, () => {
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
        candidatesPage.openCandidatesPage();
        commonHelper.deleteAllRecords(
          ".oxd-checkbox-input-icon",
          ".oxd-button--label-danger",
          ".oxd-button--label-danger"
        );
        return cy.fixture("candidateInfo").then((candidateData) => {
          return candidatesHelper.addCandidate(
            candidateData,
            vacancyResponse.data.id
          );
        });
      })
      // Verify the candidate record
      .then(() => {
        candidatesPage.openCandidatesPage();
        let candidateTableData = [
          {
            Vacancy: "QA Automation",
            Candidate: "Mohammad Saed Abohasan",
            "Hiring Manager": "Mohammad Saed Abohasan",
            "Date of Application": "2023-10-14",
            Status: "Application Initiated",
          },
        ];
        commonHelper.checkRows(".oxd-table-row", candidateTableData);
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
