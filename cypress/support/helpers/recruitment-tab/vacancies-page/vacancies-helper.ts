import { ICreateVacancyPayload } from "../../../apis/payload/recruitment-tab/vacancies-page/add-vacancy-payload";
import VacanciesInit from "../../../initializers/recruitment-tab/vacancies-page/vacancies-init";
import SharedInit from "../../../initializers/shared-init";
import AdminHelper from "../../admin-tab/admin-helper";
import PimHelper from "../../pim-tab/pim-helper";

export const URLs = {
  vacancies: `/web/index.php/api/v2/recruitment/vacancies`,
};

export const prepareCandidate = () => {
  let employeeData: any = {};
  let jobData: any = {};
  let vacancyData: any = {};

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
      // Add an employee
      .then((vacancyInfo: any) => {
        vacancyData = vacancyInfo;
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
      });
  };

  return cy.wrap(prepare()).then(() => ({
    employeeData,
    jobData,
    vacancyData,
  }));
};

export const cleanupEntities = (employeeNumber: any, jobId: any, vacancyId: any) => {
  PimHelper.deleteEmployee(employeeNumber);
  AdminHelper.deleteJobTitle(jobId);
  VacanciesHelper.deleteVacancy(vacancyId);
};

export default class VacanciesHelper {
  static addVacancy(vacancyData: ICreateVacancyPayload, employeeId: number) {
    return cy
      .addVacancy(
        "POST",
        URLs.vacancies,
        VacanciesInit.initVacancy(vacancyData, employeeId)
      )
      .then((response) => response.data);
  }

  static deleteVacancy(vacancyId: number) {
    return cy.deleteItem(
      "DELETE",
      URLs.vacancies,
      SharedInit.initDeleteItem(vacancyId)
    );
  }
}
