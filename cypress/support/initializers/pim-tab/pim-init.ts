import { ICreateEmployeePayload } from "../../apis/payload/pim-tab/add-employee-payload";
import { IDeleteEmployeePayload } from "../../apis/payload/pim-tab/delete-employee-payload";

export default class PimInit {
  static initEmployee(
    employeeData: ICreateEmployeePayload
  ): ICreateEmployeePayload {
    const { employeeId, firstName, middleName, lastName, empPicture } =
      employeeData;
    const payload = {
      employeeId,
      firstName,
      middleName,
      lastName,
      empPicture,
    };
    return payload;
  }

  static initDeleteEmployee(empNumber: number): IDeleteEmployeePayload {
    const payload = {
      ids: [empNumber],
    };
    return payload;
  }
}
