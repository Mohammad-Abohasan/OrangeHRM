import LoginPage from "../../../support/pageObjects/LoginPage";
import CandidatesPage from "../../../support/pageObjects/RecruitmentTab/CandidatesPage";
import VacanciesPage from "../../../support/pageObjects/RecruitmentTab/VacanciesPage";
import DataUtils from "../../../support/DataUtils";
import vacanciesHelper from "../../../support/helpers/vacanciesHelper";
import candidatesHelper from "../../../support/helpers/candidatesHelper";

const loginPage: LoginPage = new LoginPage();
const candidatesPage: CandidatesPage = new CandidatesPage();
const vacanciesPage: VacanciesPage = new VacanciesPage();
const dataUtils: DataUtils = new DataUtils();

describe("Recruitment: Candidates & Vacancies table data validation", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.fixture("loginInfo").then((loginData: any) => {
      loginPage.login(loginData.userName.valid, loginData.password.valid);
    });
  });

  it.skip("Recruitment - Candidates: verify number of records", () => {
    candidatesPage.openCandidatesPage();
    candidatesHelper
      .getCandidatesTableDataUsingAPI()
      .as("Candidates Page")
      .then((response: any) => {
        candidatesPage.checkNumberOfRecords(response?.body.meta.total);
      });
  });

  it("Recruitment - Candidates", () => {
    cy.fixture("employeeInfoPIM").then((infoData: any) => {
      dataUtils.pimTab
        .addEmployee(
          infoData.firstName,
          infoData.middleName,
          infoData.lastName,
          infoData.id,
          infoData.userName,
          infoData.password
        )
        .then((response) => {
          cy.fixture("vacancyInfo").then((vacancyData: any) => {
            vacanciesHelper
              .addVacancy(vacancyData, response.body.data.employee.empNumber)
              .then((vacancyResponse) => {
                cy.fixture("candidateInfo").then((candidateData: any) => {
                  candidatesHelper
                    .addCandidate(candidateData, vacancyResponse.data.id)
                    .then((candidateResponse) => {
                      cy.request({
                        url: `/web/index.php/api/v2/recruitment/candidates/${candidateResponse.data.id}/shortlist`,
                        method: "PUT",
                      }).then(() => {
                        cy.visit(
                          `/web/index.php/recruitment/addCandidate/${candidateResponse.data.id}`
                        );
                        cy.get(".oxd-loading-spinner-container").should(
                          "exist"
                        );
                        cy.get(".oxd-button--success").click({ force: true });
                        cy.get(".oxd-loading-spinner-container").should(
                          "exist"
                        );
                        cy.get(".oxd-label")
                          .contains("Interview Title")
                          .parents()
                          .eq(1)
                          .children()
                          .eq(1)
                          .type("Mohammad Interview");
                        cy.get(".oxd-autocomplete-text-input > input").type(
                          `${infoData.firstName}`
                        );
                        cy.get(".oxd-autocomplete-option")
                          .contains(
                            `${infoData.firstName} ${infoData.middleName} ${infoData.lastName}`
                          )
                          .click();
                        cy.get(".oxd-date-input").type("2024-04-02");
                        cy.get(".oxd-time-input").type("04:00 AM");
                        cy.get('button[type="submit"]').click();
                        cy.get(".oxd-text--subtitle-2").should(
                          "contain",
                          "Interview Scheduled"
                        );
                      });
                    });
                });
              });
          });
        });
    });
  });

  afterEach(() => {
    cy.fixture("employeeInfoPIM").then((infoData: any) => {
      dataUtils.pimTab.deleteEmployee(infoData.id);
    });
  });
});
