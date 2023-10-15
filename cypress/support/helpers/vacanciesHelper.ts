import { ICreateVacancyPayload } from "../API/payload/Recruitment/Vacancies/addVacancyPayload";
import VacanciesInit from "../initializers/vacanciesInit";

export const URLs = {
  vacancies: `/web/index.php/api/v2/recruitment/vacancies`,
};

export default class Vacancies {
  static addVacancy(vacancyData: ICreateVacancyPayload, employeeId: number) {
    return cy.addVacancy(
      "POST",
      URLs.vacancies,
      VacanciesInit.initVacancy(vacancyData, employeeId)
    );
  }
}
