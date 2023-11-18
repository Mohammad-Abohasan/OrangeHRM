import { ICreateJobTitlePayload } from "../../apis/payload/admin-tab/job-page/add-jobTitle-payload";
import { ICreateLocationPayload } from "../../apis/payload/admin-tab/location-page/add-location-payload";
import { ICreateAdminPayload } from "../../apis/payload/admin-tab/user-management-page/add-admin-payload";
import SharedHelper from "../../helpers/shared-helper";

export default class AdminInit {
  static initAdmin(
    adminData: ICreateAdminPayload,
    empNumber: number
  ): ICreateAdminPayload {
    const { username, password, status, userRoleId } = adminData;
    const payload = {
      username: `${username}_${SharedHelper.generateRandomString()}`,
      password,
      status,
      userRoleId,
      empNumber,
    };
    return payload;
  }

  static initJobTitle(jobTitleData: ICreateJobTitlePayload): ICreateJobTitlePayload {
    const payload = {
      ...jobTitleData,
      title: `${jobTitleData.title} - ${SharedHelper.generateRandomString(3, 5)}`,
    };
    return payload;
  }

  static initLocation(locationData: ICreateLocationPayload): ICreateLocationPayload {
    const payload = {
      ...locationData,
      name: `${locationData.name} - ${SharedHelper.generateRandomString(3, 5)}`,
    };
    return payload;
  }
}
