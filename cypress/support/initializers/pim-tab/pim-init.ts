import { ICreateEmployeePayload } from "../../apis/payload/pim-tab/add-employee-payload";
import { ICreateEmployeeSalaryComponentsPayload } from "../../apis/payload/pim-tab/add-employee-salary-components-payload";
import { IUpdateEmployeeJobDetailsPayload } from "../../apis/payload/pim-tab/update-employee-job-details-payload";
import SharedHelper from "../../helpers/shared-helper";

export default class PimInit {
  static initEmployee(employeeData: ICreateEmployeePayload): ICreateEmployeePayload {
    const { employeeId, firstName, middleName, lastName, empPicture } = employeeData;
    const payload = {
      employeeId,
      firstName: `${SharedHelper.generateRandomString(2, 5)}-${firstName}`,
      middleName,
      lastName,
      empPicture,
    };
    return payload;
  }

  static initUpdateEmployeeJobDetails(
    employeeJobDetails: IUpdateEmployeeJobDetailsPayload
  ): IUpdateEmployeeJobDetailsPayload {
    const payload = {
      ...employeeJobDetails,
    };
    return payload;
  }

  static initEmployeeSalaryComponentsDetails(
    employeeSalaryComponentsDetails: ICreateEmployeeSalaryComponentsPayload
  ): ICreateEmployeeSalaryComponentsPayload {
    const payload = {
      ...employeeSalaryComponentsDetails,
      salaryAmount: `${SharedHelper.generateRandomNumber(50000, 60000)}`,
    };
    return payload;
  }
}
