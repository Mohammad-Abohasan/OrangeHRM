import { ICreateAdminPayload } from "../../apis/payload/admin-tab/user-management-page/add-admin-payload";
import AdminInit from "../../initializers/admin-tab/admin-init";

export const URLs = {
  admins: `/web/index.php/api/v2/admin/users`,
};

export default class AdminHelper {
  static addAdmin(adminData: ICreateAdminPayload, empNumber: number) {
    return cy.addAdmin(
      "POST",
      URLs.admins,
      AdminInit.initAdmin(adminData, empNumber)
    );
  }
}
