import { ICreateVacancyPayload } from "../API/payload/Recruitment/Vacancies/addVacancyPayload";

export default class Vacancies {
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
