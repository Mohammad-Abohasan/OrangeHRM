import { ICreateVacancyPayload } from "../../../apis/payload/recruitmentTab/vacanciesPage/addVacancyPayload";
import VacanciesInit from "../../../initializers/recruitmentTab/vacanciesPage/vacanciesInit";

export const URLs = {
  vacancies: `/web/index.php/api/v2/recruitment/vacancies`,
};

export default class VacanciesHelper {
  static addVacancy(vacancyData: ICreateVacancyPayload, employeeId: number) {
    return cy.addVacancy(
      "POST",
      URLs.vacancies,
      VacanciesInit.initVacancy(vacancyData, employeeId)
    );
  }
}
