import { ICreateVacancyPayload } from "../../../apis/payload/recruitmentTab/vacanciesPage/addVacancyPayload";

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
