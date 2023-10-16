import { ICreateAdminPayload } from "../API/payload/Admin/addAdminPayload";
import AdminInit from "../initializers/adminInit";

export const URLs = {
  admins: `/web/index.php/api/v2/admin/users`,
};

export default class Admin {
  static addAdmin(adminData: ICreateAdminPayload, empNumber: number) {
    return cy.addAdmin(
      "POST",
      URLs.admins,
      AdminInit.initAdmin(adminData, empNumber)
    );
  }
}
