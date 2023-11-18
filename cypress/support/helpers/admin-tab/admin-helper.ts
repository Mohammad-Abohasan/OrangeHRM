import { ICreateJobTitlePayload } from "../../apis/payload/admin-tab/job-page/add-jobTitle-payload";
import { ICreateLocationPayload } from "../../apis/payload/admin-tab/location-page/add-location-payload";
import { ICreateAdminPayload } from "../../apis/payload/admin-tab/user-management-page/add-admin-payload";
import AdminInit from "../../initializers/admin-tab/admin-init";
import SharedInit from "../../initializers/shared-init";

export const URLs = {
  adminBaseUrl: "/web/index.php/api/v2/admin",
  users: "/users",
  jobTitles: "/job-titles",
  locations: "/locations",
};

export default class AdminHelper {
  static addAdmin(adminData: ICreateAdminPayload, empNumber: number) {
    return cy
      .addAdmin(
        "POST",
        `${URLs.adminBaseUrl}${URLs.users}}`,
        AdminInit.initAdmin(adminData, empNumber)
      )
      .then((response) => response.data);
  }

  static addJobTitle(jobTitleData: ICreateJobTitlePayload) {
    return cy
      .addJobTitle(
        "POST",
        `${URLs.adminBaseUrl}${URLs.jobTitles}`,
        AdminInit.initJobTitle(jobTitleData)
      )
      .then((response: any) => response.data);
  }

  static deleteJobTitle(jobTitleId: number) {
    return cy
      .deleteItem(
        "DELETE",
        `${URLs.adminBaseUrl}${URLs.jobTitles}`,
        SharedInit.initDeleteItem(jobTitleId)
      )
  }

  static addLocation(locationData: ICreateLocationPayload) {
    return cy
      .addLocation(
        "POST",
        `${URLs.adminBaseUrl}${URLs.locations}`,
        AdminInit.initLocation(locationData)
      )
      .then((response: any) => response.data);
  }

  static deleteLocation(locationId: number) {
    return cy
      .deleteItem(
        "DELETE",
        `${URLs.adminBaseUrl}${URLs.locations}`,
        SharedInit.initDeleteItem(locationId)
      )
  }
}
