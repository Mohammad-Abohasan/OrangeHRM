import CandidatesPage from "../../support/pageObjects/recruitmentTab/candidatesPage/CandidatesPage";
import VacanciesPage from "../../support/pageObjects/recruitmentTab/vacanciesPage/VacanciesPage";
import vacanciesHelper from "../../support/helpers/recruitmentTab/vacanciesPage/VacanciesHelper";
import candidatesHelper from "../../support/helpers/recruitmentTab/candidatesPage/CandidatesHelper";
import pimHelper from "../../support/helpers/pimTab/PimHelper";
import sharedHelper from "../../support/helpers/SharedHelper";

import * as path from "path";

const candidatesPage: CandidatesPage = new CandidatesPage();
const vacanciesPage: VacanciesPage = new VacanciesPage();

let employeeData: any = {};
describe("Recruitment: Candidates & Vacancies table data validation", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();

    cy.fixture("pimTab/employeeInfo.json").then((empData) => {
      employeeData = empData;
    });
  });

  it("Recruitment - Vacancies: The user should be able to attach a file to a vacancy.", () => {
    pimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Add a vacancy
      .then((employeeResponse) => {
        return cy
          .fixture("recruitmentTab/vacanciesPage/vacancyInfo.json")
          .then((vacancyData) => {
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
        vacanciesPage.addAttachment("cypress/fixtures/recruitmentTab/vacanciesPage/vacancyAttachment.xlsx");
        cy.get(".oxd-toast").should("exist");
        cy.fixture(
          "recruitmentTab/vacanciesPage/vacancyAttachmentsInfo.json"
        ).then((attachmentsData) => {
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
        return cy
          .fixture("recruitmentTab/vacanciesPage/vacancyInfo.json")
          .then((vacancyData) => {
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
        const xlsxPath: string =
          "cypress/fixtures/recruitmentTab/vacanciesPage/vacancyAttachment.xlsx";
        vacanciesPage.addAttachment(xlsxPath);
        cy.get(".oxd-toast").should("exist");
        cy.fixture(
          "recruitmentTab/vacanciesPage/vacancyAttachmentsInfo.json"
        ).then((attachmentsData) => {
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

        const xlsxPath: string = "cypress/downloads/vacancyAttachment.xlsx";
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
        return cy
          .fixture("recruitmentTab/vacanciesPage/vacancyInfo.json")
          .then((vacancyData) => {
            return vacanciesHelper.addVacancy(
              vacancyData,
              employeeResponse.data.empNumber
            );
          });
      })
      // Add a candidate
      .then((vacancyResponse) => {
        return cy
          .fixture("recruitmentTab/candidatesPage/candidateInfo.json")
          .then((candidateData) => {
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
        candidatesPage.addResume(
          "cypress/fixtures/recruitmentTab/candidatesPage/candidateResume.docx"
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
        return cy
          .fixture("recruitmentTab/vacanciesPage/vacancyInfo.json")
          .then((vacancyData) => {
            return vacanciesHelper.addVacancy(
              vacancyData,
              employeeResponse.data.empNumber
            );
          });
      })
      // Add a candidate
      .then((vacancyResponse) => {
        return cy
          .fixture("recruitmentTab/candidatesPage/candidateInfo.json")
          .then((candidateData) => {
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

  it("Recruitment - Candidates: Add a new candidate and verify the record", () => {
    pimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Add a vacancy
      .then((employeeResponse) => {
        return cy
          .fixture("recruitmentTab/vacanciesPage/vacancyInfo.json")
          .then((vacancyData) => {
            return vacanciesHelper.addVacancy(
              vacancyData,
              employeeResponse.data.empNumber
            );
          });
      })
      // Add a candidate
      .then((vacancyResponse) => {
        candidatesPage.openCandidatesPage();
        return cy
          .fixture("recruitmentTab/candidatesPage/candidateInfo.json")
          .then((candidateData) => {
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