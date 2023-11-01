import * as path from "path";
import CandidatesPageActions from "../../support/pageObjects/recruitmentTab/candidatesPage/CandidatesPageActions";
import CandidatesPageAssertions from "../../support/pageObjects/recruitmentTab/candidatesPage/CandidatesPageAssertions";
import VacanciesPageActions from "../../support/pageObjects/recruitmentTab/vacanciesPage/VacanciesPageActions";
import VacanciesPageAssertions from "../../support/pageObjects/recruitmentTab/vacanciesPage/VacanciesPageAssertions";
import candidatesHelper from "../../support/helpers/recruitmentTab/candidatesPage/CandidatesHelper";
import vacanciesHelper from "../../support/helpers/recruitmentTab/vacanciesPage/VacanciesHelper";
import pimHelper from "../../support/helpers/pimTab/PimHelper";
import SharedHelper from "../../support/helpers/SharedHelper";

const candidatesPageActions: CandidatesPageActions =
  new CandidatesPageActions();
const candidatesPageAssertions: CandidatesPageAssertions =
  new CandidatesPageAssertions();
const vacanciesPageActions: VacanciesPageActions = new VacanciesPageActions();
const vacanciesPageAssertions: VacanciesPageAssertions =
  new VacanciesPageAssertions();
enum StatusCandidate {
  ApplicationInitiated = "Application Initiated",
  Shortlisted = "Shortlisted",
  InterviewScheduled = "Interview Scheduled",
  InterviewPassed = "Interview Passed",
  InterviewFailed = "Interview Failed",
  JobOffered = "Job Offered",
  OfferDeclined = "Offer Declined",
  Hired = "Hired",
  Rejected = "fRejected",
}

let employeeData: any = {};
describe("Recruitment: Candidates & Vacancies table data validation", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();

    cy.fixture("pimTab/employeeInfo.json").then((empData) => {
      employeeData = empData;
    });
  });

  it("Recruitment - Vacancies: The user should be able to attach a file to a vacancy", () => {
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
              employeeResponse.empNumber
            );
          });
      })
      // Attach a file to the vacancy
      .then((vacancyResponse) => {
        vacanciesPageActions.editVacancyById(vacancyResponse.id);
        vacanciesPageActions.addAttachmentToVacancy(
          "cypress/fixtures/recruitmentTab/vacanciesPage/vacancyAttachment.xlsx"
        );
        SharedHelper.checkToastIsExist(true);
        cy.fixture(
          "recruitmentTab/vacanciesPage/vacancyAttachmentInfo.json"
        ).then((attachmentData) => {
          vacanciesPageAssertions.checkRecordsContainsAttachment(
            attachmentData
          );
          vacanciesPageActions.downloadAnAttachment();
        });
      })
      // Delete the employee after the test
      .then(() => {
        return pimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        // TODO: Fix this issue
        vacanciesPageActions.openVacanciesPage();
        SharedHelper.selectItemFromDropdown(
          "Hiring Manager",
          "Mohammad Abohasan"
        );
        SharedHelper.clickSubmitButtonIsContains("Search");
        SharedHelper.selectAllRecordsFoundAndDelete();

        pimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
      });
  });

  it("Recruitment - Vacancies: The user should be able to download the vacancy attachment (excel file)", () => {
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
              employeeResponse.empNumber
            );
          });
      })
      // Attach a file to the vacancy
      .then((vacancyResponse) => {
        vacanciesPageActions.editVacancyById(vacancyResponse.id);
        const xlsxPath: string =
          "cypress/fixtures/recruitmentTab/vacanciesPage/vacancyAttachment.xlsx";
        vacanciesPageActions.addAttachmentToVacancy(xlsxPath);
        SharedHelper.checkToastIsExist(true);
        cy.fixture(
          "recruitmentTab/vacanciesPage/vacancyAttachmentInfo.json"
        ).then((attachmentData) => {
          vacanciesPageAssertions.checkRecordsContainsAttachment(
            attachmentData
          );
        });
        return cy
          .task("convertXlsxToJson", [xlsxPath, true])
          .then((jsonPathResponse: any) => {
            return cy
              .fixture(path.basename(jsonPathResponse))
              .then((attachmentData) => {
                // Delete the json file after the test
                return cy.task("deleteFile", jsonPathResponse).then(() => {
                  return [vacancyResponse.id, attachmentData];
                });
              });
          });
      })
      // Download the attachment and verify the content
      .then((vacancyResponse2) => {
        const [vacancyResponseId, originalAttachmentData] = vacancyResponse2;
        vacanciesPageActions.editVacancyById(vacancyResponseId);
        vacanciesPageActions.downloadAnAttachment();

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
        // TODO: Fix this issue
        vacanciesPageActions.openVacanciesPage();
        SharedHelper.selectItemFromDropdown(
          "Hiring Manager",
          "Mohammad Abohasan"
        );
        SharedHelper.clickSubmitButtonIsContains("Search");
        SharedHelper.selectAllRecordsFoundAndDelete();

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
              employeeResponse.empNumber
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
              vacancyResponse.id
            );
          });
      })
      // Verify the candidate record
      .then((candidateResponse) => {
        candidatesPageActions.editCandidateById(candidateResponse.id);
        const resumePath: string =
          "cypress/fixtures/recruitmentTab/candidatesPage/candidateResume.docx";
        candidatesPageActions.addResume(resumePath);
        SharedHelper.checkToastIsExist(true);
        candidatesPageAssertions.checkResumeName(resumePath.split("/").pop()!);
      })
      // Delete the employee after the test
      .then(() => {
        return pimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        // TODO: Fix this issue
        candidatesPageActions.openCandidatesPage();
        SharedHelper.selectOptionFromListBox(
          "Candidate Name",
          "Mohammad"
        );
        SharedHelper.clickSubmitButtonIsContains("Search");
        SharedHelper.selectAllRecordsFoundAndDelete();

        // TODO: Fix this issue
        vacanciesPageActions.openVacanciesPage();
        SharedHelper.selectItemFromDropdown(
          "Hiring Manager",
          "Mohammad Abohasan"
        );
        SharedHelper.clickSubmitButtonIsContains("Search");
        SharedHelper.selectAllRecordsFoundAndDelete();

        pimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
      });
  });

  it("Recruitment - Candidates: verify number of records", () => {
    candidatesPageActions.openCandidatesPage();
    candidatesHelper.getCandidatesTableDataUsingAPI().then((response: any) => {
      candidatesPageAssertions.checkNumberOfRecords(response.meta.total);
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
              employeeResponse.empNumber
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
              vacancyResponse.id
            );
          });
      })
      // Shortlist the candidate and schedule an interview
      .then((candidateResponse) => {
        candidatesHelper.shortlistCandidate(candidateResponse.id);
        candidatesPageActions.editCandidateById(candidateResponse.id);
        SharedHelper.checkLoadingSpinnerIsExist(true);
        candidatesPageActions.scheduleInterview(employeeData);
        candidatesPageAssertions.checkStatus(
          StatusCandidate.InterviewScheduled
        );
      })
      // Delete the employee after the test
      .then(() => {
        return pimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        // TODO: Fix this issue
        candidatesPageActions.openCandidatesPage();
        SharedHelper.selectOptionFromListBox(
          "Candidate Name",
          "Mohammad"
        );
        SharedHelper.clickSubmitButtonIsContains("Search");
        SharedHelper.selectAllRecordsFoundAndDelete();

        // TODO: Fix this issue
        vacanciesPageActions.openVacanciesPage();
        SharedHelper.selectItemFromDropdown(
          "Hiring Manager",
          "Mohammad Abohasan"
        );
        SharedHelper.clickSubmitButtonIsContains("Search");
        SharedHelper.selectAllRecordsFoundAndDelete();

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
              employeeResponse.empNumber
            );
          });
      })
      // Add a candidate
      .then((vacancyResponse) => {
        candidatesPageActions.openCandidatesPage();
        return cy
          .fixture("recruitmentTab/candidatesPage/candidateInfo.json")
          .then((candidateData) => {
            return candidatesHelper.addCandidate(
              candidateData,
              vacancyResponse.id
            );
          });
      })
      // Verify the candidate record
      .then(() => {
        candidatesPageActions.openCandidatesPage();
        cy.fixture(
          "recruitmentTab/candidatesPage/candidateRecordInfo.json"
        ).then((candidateRecordData: any) => {
          candidatesPageActions.searchForCandidate(candidateRecordData);
          candidatesPageAssertions.checkRecordsContainsCandidate(
            candidateRecordData
          );
        });
      })
      // Delete the employee after the test
      .then(() => {
        return pimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        // TODO: Fix this issue
        candidatesPageActions.openCandidatesPage();
        SharedHelper.selectOptionFromListBox(
          "Candidate Name",
          "Mohammad"
        );
        SharedHelper.clickSubmitButtonIsContains("Search");
        SharedHelper.selectAllRecordsFoundAndDelete();

        // TODO: Fix this issue
        vacanciesPageActions.openVacanciesPage();
        SharedHelper.selectItemFromDropdown(
          "Hiring Manager",
          "Mohammad Abohasan"
        );
        SharedHelper.clickSubmitButtonIsContains("Search");
        SharedHelper.selectAllRecordsFoundAndDelete();

        pimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
      });
  });
});
