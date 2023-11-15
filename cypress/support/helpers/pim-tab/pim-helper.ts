import { ICreateEmployeePayload } from "../../apis/payload/pim-tab/add-employee-payload";
import { ICreateEmployeeSalaryComponentsPayload } from "../../apis/payload/pim-tab/add-employee-salary-components-payload";
import { IUpdateEmployeeJobDetailsPayload } from "../../apis/payload/pim-tab/update-employee-job-details-payload";
import PimInit from "../../initializers/pim-tab/pim-init";
import SharedInit from "../../initializers/shared-init";

export const URLs = {
  employees: `/web/index.php/api/v2/pim/employees`,
};

export default class PimHelper {
  static addEmployee(employeeData: ICreateEmployeePayload) {
    return cy
      .addEmployee("POST", URLs.employees, PimInit.initEmployee(employeeData))
      .then((response) => response.data);
  }

  static getEmployee(employeeId: string) {
    return cy.getEmployee("GET", `${URLs.employees}?employeeId=${employeeId}`);
  }

  static deleteEmployee(empNumber: number) {
    return cy.deleteItem(
      "DELETE",
      URLs.employees,
      SharedInit.initDeleteItem(empNumber)
    );
  }

  static updateEmployeeJobDetails(
    employeeJobDetails: IUpdateEmployeeJobDetailsPayload,
    empNumber: number
  ) {
    return cy
      .updateEmployeeJobDetails(
        "PUT",
        `${URLs.employees}/${empNumber}/job-details`,
        PimInit.initUpdateEmployeeJobDetails(employeeJobDetails)
      )
      .then((response) => response.data);
  }

  static addEmployeeSalaryComponents(
    employeeSalaryComponentsDetails: ICreateEmployeeSalaryComponentsPayload,
    empNumber: number
  ) {
    return cy
      .addEmployeeSalaryComponents(
        "POST",
        `${URLs.employees}/${empNumber}/salary-components`,
        PimInit.initEmployeeSalaryComponentsDetails(employeeSalaryComponentsDetails)
      )
      .then((response) => response.data);
  }
}
