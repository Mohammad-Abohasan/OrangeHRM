import { ICreateAdminPayload } from "../../apis/payload/adminTab/userManagementPage/addAdminPayload";

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
