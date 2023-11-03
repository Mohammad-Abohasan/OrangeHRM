import { ICreateAdminPayload } from "../../apis/payload/admin-tab/user-management-page/add-admin-payload";

export default class AdminInit {
  static initAdmin(
    adminData: ICreateAdminPayload,
    empNumber: number
  ): ICreateAdminPayload {
    const { username, password, status, userRoleId } = adminData;
    const payload = {
      username,
      password,
      status,
      userRoleId,
      empNumber,
    };
    return payload;
  }
}
