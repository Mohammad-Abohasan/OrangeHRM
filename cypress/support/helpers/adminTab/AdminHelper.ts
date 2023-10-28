import { ICreateAdminPayload } from "../../apis/payload/adminTab/userManagementPage/addAdminPayload";
import AdminInit from "../../initializers/adminTab/adminInit";

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
