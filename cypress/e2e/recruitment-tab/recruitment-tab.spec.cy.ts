import * as path from "path";
import CandidatesPageActions from "../../support/page-objects/recruitment-tab/candidates-page/candidates-page-actions";
import CandidatesPageAssertions from "../../support/page-objects/recruitment-tab/candidates-page/candidates-page-assertions";
import VacanciesPageActions from "../../support/page-objects/recruitment-tab/vacancies-page/vacancies-page-actions";
import VacanciesPageAssertions from "../../support/page-objects/recruitment-tab/vacancies-page/vacancies-page-assertions";
import candidatesHelper from "../../support/helpers/recruitment-tab/candidates-page/candidates-helper";
import vacanciesHelper from "../../support/helpers/recruitment-tab/vacancies-page/vacancies-helper";
import PimHelper from "../../support/helpers/pim-tab/pim-helper";
import SharedHelper from "../../support/helpers/shared-helper";

const candidatesPageActions: CandidatesPageActions =
  new CandidatesPageActions();
const candidatesPageAssertions: CandidatesPageAssertions =
  new CandidatesPageAssertions();
const vacanciesPageActions: VacanciesPageActions = new VacanciesPageActions();
const vacanciesPageAssertions: VacanciesPageAssertions =
  new VacanciesPageAssertions();
enum STATUS_CANDIDATE {
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

    cy.fixture("pim-tab/employeeInfo.json").then((empData) => {
      employeeData = empData;
    });
  });

  it("Recruitment - Vacancies: The user should be able to attach a file to a vacancy", () => {
    PimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Add a vacancy
      .then((employeeResponse) => {
        employeeData.firstName = employeeResponse.firstName;
        return cy
          .fixture("recruitment-tab/vacancies-page/vacancyInfo.json")
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
          "cypress/fixtures/recruitment-tab/vacancies-page/vacancyAttachment.xlsx"
        );
        SharedHelper.checkToastIsExist(true);
        cy.fixture(
          "recruitment-tab/vacancies-page/vacancyAttachmentInfo.json"
        ).then((attachmentData) => {
          vacanciesPageAssertions.checkRecordsContainsAttachment(
            attachmentData
          );
          vacanciesPageActions.downloadAnAttachment();
        });
      })
      // Delete the employee after the test
      .then(() => {
        return PimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        PimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
      });
  });

  it("Recruitment - Vacancies: The user should be able to download the vacancy attachment (excel file)", () => {
    PimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Add a vacancy
      .then((employeeResponse) => {
        employeeData.firstName = employeeResponse.firstName;
        return cy
          .fixture("recruitment-tab/vacancies-page/vacancyInfo.json")
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
          "cypress/fixtures/recruitment-tab/vacancies-page/vacancyAttachment.xlsx";
        vacanciesPageActions.addAttachmentToVacancy(xlsxPath);
        SharedHelper.checkToastIsExist(true);
        cy.fixture(
          "recruitment-tab/vacancies-page/vacancyAttachmentInfo.json"
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
        return PimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        PimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
      });
  });

  it("Recruitment - Candidates: Attach Resume File", () => {
    PimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Add a vacancy
      .then((employeeResponse) => {
        employeeData.firstName = employeeResponse.firstName;
        return cy
          .fixture("recruitment-tab/vacancies-page/vacancyInfo.json")
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
          .fixture("recruitment-tab/candidates-page/candidateInfo.json")
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
          "cypress/fixtures/recruitment-tab/candidates-page/candidateResume.docx";
        candidatesPageActions.addResume(resumePath);
        SharedHelper.checkToastIsExist(true);
        candidatesPageAssertions.checkResumeName(resumePath.split("/").pop()!);
      })
      // Delete the employee after the test
      .then(() => {
        return PimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        PimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
      });
  });

  it("Recruitment - Candidates: verify number of records", () => {
    candidatesPageActions.openCandidatesPage();
    candidatesHelper.getCandidatesTableDataUsingAPI().then((response: any) => {
      candidatesPageAssertions.checkNumberOfRecords(response.meta.total);
    });
  });

  it("Recruitment - Candidates: Schedule an Interview for a Candidate", () => {
    PimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Add a vacancy
      .then((employeeResponse) => {
        employeeData.firstName = employeeResponse.firstName;
        return cy
          .fixture("recruitment-tab/vacancies-page/vacancyInfo.json")
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
          .fixture("recruitment-tab/candidates-page/candidateInfo.json")
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
        SharedHelper.waitUntilItFinished();
        candidatesPageActions.scheduleInterview(employeeData);
        candidatesPageAssertions.checkStatus(
          STATUS_CANDIDATE.InterviewScheduled
        );
      })
      // Delete the employee after the test
      .then(() => {
        return PimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        PimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
      });
  });

  it("Recruitment - Candidates: Add a new candidate and verify the record", () => {
    PimHelper
      // Add an employee
      .addEmployee(employeeData)
      // Add a vacancy
      .then((employeeResponse) => {
        employeeData.firstName = employeeResponse.firstName;
        return cy
          .fixture("recruitment-tab/vacancies-page/vacancyInfo.json")
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
          .fixture("recruitment-tab/candidates-page/candidateInfo.json")
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
          "recruitment-tab/candidates-page/candidateRecordInfo.json"
        ).then((candidateRecordData: any) => {
          candidatesPageActions.searchForCandidate(candidateRecordData);
          candidatesPageAssertions.checkRecordsContainsCandidate(
            candidateRecordData
          );
        });
      })
      // Delete the employee after the test
      .then(() => {
        return PimHelper.getEmployee(employeeData.employeeId);
      })
      .then((employeeResponse) => {
        PimHelper.deleteEmployee(employeeResponse.data[0].empNumber);
      });
  });
});
