import LoginPage from "../../../support/pageObjects/LoginPage";
import CandidatesPage from "../../../support/pageObjects/RecruitmentTab/CandidatesPage";
import VacanciesPage from "../../../support/pageObjects/RecruitmentTab/VacanciesPage";
import vacanciesHelper from "../../../support/helpers/vacanciesHelper";
import candidatesHelper from "../../../support/helpers/candidatesHelper";
import pimHelper from "../../../support/helpers/pimHelper";
import sharedHelper from "../../../support/helpers/sharedHelper";

import * as path from "path";

const loginPage: LoginPage = new LoginPage();
const candidatesPage: CandidatesPage = new CandidatesPage();
const vacanciesPage: VacanciesPage = new VacanciesPage();

let employeeData: any = {};
describe("Recruitment: Candidates & Vacancies table data validation", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.loginOrangeHRM();

    cy.fixture("employeeInfo").then((empData) => {
      employeeData = empData;
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
      // Attach a file to the vacancy
      .then((vacancyResponse) => {
        cy.visit(
          `/web/index.php/recruitment/addJobVacancy/${vacancyResponse.data.id}`
        );
        vacanciesPage.addAttachment("cypress/fixtures/VacancyAttachment.xlsx");
        cy.get(".oxd-toast").should("exist");
        cy.fixture("vacancyAttachmentsInfo").then((attachmentsData) => {
          sharedHelper.checkRows(".oxd-table-row", attachmentsData);
        });
      })
      // Delete the employee after the test
      .then(() => {
        return pimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        pimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
      });
  });

  it("Recruitment - Vacancies: The user should be able to download the vacancy attachment (excel file).", () => {
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
      // Attach a file to the vacancy
      .then((vacancyResponse) => {
        cy.visit(
          `/web/index.php/recruitment/addJobVacancy/${vacancyResponse.data.id}`
        );
        const xlsxPath: string = "cypress/fixtures/VacancyAttachment.xlsx";
        vacanciesPage.addAttachment(xlsxPath);
        cy.get(".oxd-toast").should("exist");
        cy.fixture("vacancyAttachmentsInfo").then((attachmentsData) => {
          sharedHelper.checkRows(".oxd-table-row", attachmentsData);
        });
        return cy
          .task("convertXlsxToJson", [xlsxPath, true])
          .then((jsonPathResponse: any) => {
            return cy
              .fixture(path.basename(jsonPathResponse))
              .then((attachmentData) => {
                // Delete the json file after the test
                return cy.task("deleteFile", jsonPathResponse).then(() => {
                  return [vacancyResponse.data.id, attachmentData];
                });
              });
          });
      })
      // Download the attachment and verify the content
      .then((vacancyResponse2) => {
        const [vacancyResponseId, originalAttachmentData] = vacancyResponse2;
        cy.visit(
          `/web/index.php/recruitment/addJobVacancy/${vacancyResponseId}`
        );
        vacanciesPage.downloadAttachment();

        const xlsxPath: string = "cypress/downloads/VacancyAttachment.xlsx";
        cy.readFile(xlsxPath).should("exist"); // Verify that the file exists
        let jsonPath: string = "";
        cy.task("convertXlsxToJson", [xlsxPath, false])
          .then((jsonPathResponse: any) => {
            jsonPath = jsonPathResponse;
            cy.fixture(path.basename(jsonPathResponse)).then(
              (attachmentData) => {
                expect(attachmentData).to.deep.equal(originalAttachmentData);
              }
            );
          })
          // Delete the downloaded files
          .then(() => {
            cy.task("deleteFile", xlsxPath);
            cy.task("deleteFile", jsonPath);
          });
      })
      // Delete the employee after the test
      .then(() => {
        return pimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        pimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
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
        sharedHelper.checkRows(".oxd-table-row", candidateTableData);
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
