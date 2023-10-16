import { ICreateEmployeePayload } from "../API/payload/PIM/addEmployeePayload";
import { IDeleteEmployeePayload } from "../API/payload/PIM/deleteEmployeePayload";

export default class PIM {
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
