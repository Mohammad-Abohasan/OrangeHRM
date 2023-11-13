import { ICreateVacancyPayload } from "../../../apis/payload/recruitment-tab/vacancies-page/add-vacancy-payload";
import SharedHelper from "../../../helpers/shared-helper";

export default class VacanciesInit {
  static initVacancy(
    vacancyData: ICreateVacancyPayload,
    employeeId: number
  ): ICreateVacancyPayload {
    const payload = {
      ...vacancyData,
      name: `${vacancyData.name} - ${SharedHelper.generateRandomString(2, 4)}`,
      employeeId,
    };
    return payload;
  }
}
