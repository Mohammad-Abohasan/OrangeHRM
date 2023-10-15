import { ICreateEmployeePayload } from "../API/payload/PIM/addEmployeePayload";

export default class PIM {
  static initEmployee(
    employeeData: ICreateEmployeePayload
  ): ICreateEmployeePayload {
    const {employeeId, firstName, middleName, lastName, empPicture} = employeeData;
    const payload = {
      employeeId,
      firstName,
      middleName,
      lastName,
      empPicture,
    };
    return payload;
  }
}
