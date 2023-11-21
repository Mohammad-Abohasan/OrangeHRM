import * as path from "path";
import VacanciesPageActions from "../../../support/page-objects/recruitment-tab/vacancies-page/vacancies-page-actions";
import VacanciesPageAssertions from "../../../support/page-objects/recruitment-tab/vacancies-page/vacancies-page-assertions";
import VacanciesHelper, {
  cleanupEntities,
  prepareVacancy,
} from "../../../support/helpers/recruitment-tab/vacancies-page/vacancies-helper";
import PimHelper from "../../../support/helpers/pim-tab/pim-helper";
import SharedHelper from "../../../support/helpers/shared-helper";

const vacanciesPageActions: VacanciesPageActions = new VacanciesPageActions();
const vacanciesPageAssertions: VacanciesPageAssertions =
  new VacanciesPageAssertions();

let employeeData: any = {};
let jobData: any = {};
let vacancyData: any = {};

describe("Recruitment: Candidates page functionality", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();

    cy.loginOrangeHRM();
    prepareVacancy().then((preparedData: any) => {
      employeeData = preparedData.employeeData;
      jobData = preparedData.jobData;
      vacancyData = preparedData.vacancyData;
    });
  });

  afterEach(() => {
    cleanupEntities(employeeData.empNumber, jobData.id, vacancyData.id);
  });
});
