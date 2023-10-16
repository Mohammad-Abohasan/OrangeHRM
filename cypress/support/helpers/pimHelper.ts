import { ICreateEmployeePayload } from "../API/payload/PIM/addEmployeePayload";
import PimInit from "../initializers/pimInit";

export const URLs = {
  employees: `/web/index.php/api/v2/pim/employees`,
};

export default class PIM {
  static addEmployee(employeeData: ICreateEmployeePayload) {
    return cy.addEmployee(
      "POST",
      URLs.employees,
      PimInit.initEmployee(employeeData)
    );
  }

  static getEmployee(employeeId: string) {
    return cy.getEmployee(
      "GET",
      `${URLs.employees}?employeeId=${employeeId}`
    );
  }

  static deleteEmployee(empNumber: number) {
    return cy.deleteEmployee(
      "DELETE",
      URLs.employees,
      PimInit.initDeleteEmployee(empNumber)
    );
  }
}
