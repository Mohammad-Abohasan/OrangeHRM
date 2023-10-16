import { ICreateAdminPayload } from "../API/payload/Admin/addAdminPayload";

export default class PIM {
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
