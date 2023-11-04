import { ICreateVacancyPayload } from "../../../apis/payload/recruitment-tab/vacancies-page/add-vacancy-payload";

export default class VacanciesInit {
  static initVacancy(
    vacancyData: ICreateVacancyPayload,
    employeeId: number
  ): ICreateVacancyPayload {
    const payload = {
      ...vacancyData,
      "employeeId": employeeId,
    };
    return payload;
  }
}
