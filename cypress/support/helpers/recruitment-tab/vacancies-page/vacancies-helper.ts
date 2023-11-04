import { ICreateVacancyPayload } from "../../../apis/payload/recruitment-tab/vacancies-page/add-vacancy-payload";
import VacanciesInit from "../../../initializers/recruitment-tab/vacancies-page/vacancies-init";

export const URLs = {
  vacancies: `/web/index.php/api/v2/recruitment/vacancies`,
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
}
