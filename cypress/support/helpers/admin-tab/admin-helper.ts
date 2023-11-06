import { ICreateAdminPayload } from "../../apis/payload/admin-tab/user-management-page/add-admin-payload";
import AdminInit from "../../initializers/admin-tab/admin-init";

export const URLs = {
  adminBaseUrl: "/web/index.php/api/v2/admin",
  users: "/users",
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
}
