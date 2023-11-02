import SharedHelper from "../../helpers/SharedHelper";

class PimTabActions {
  elements = {
    addEmployeeButton: () =>
      cy
        .get(".orangehrm-header-container")
        .contains("[type='button']", " Add "),
    employeeInputName: (name: string, value: string) =>
      cy
        .get(".--name-grouped-field")
        .find(`[name='${name}']`)
        .clear()
        .type(value),
    createLoginDetails: () => cy.get('input[type="checkbox"]'),
    deleteAction: () => cy.get(".oxd-table-cell-actions").eq(0),
    editAction: () => cy.get(".oxd-table-cell-actions").eq(1),
    deleteBtn: () => cy.get(".oxd-button--label-danger"),
  };

  openPimTab() {
    cy.intercept("/web/index.php/api/v2/pim/employees**").as("employees");
    cy.intercept("/web/index.php/api/v2/admin/job-titles**").as("jobTitles");
    cy.intercept("/web/index.php/api/v2/admin/employment-statuses**").as(
      "employmentStatuses"
    );
    cy.intercept("/web/index.php/api/v2/admin/subunits**").as("subunits");
    cy.intercept("/web/index.php/core/i18n/messages").as("messages");

    SharedHelper.mainMenuItems().contains("PIM").click();

    cy.wait([
      "@employees",
      "@jobTitles",
      "@employmentStatuses",
      "@subunits",
      "@messages",
    ]);
  }

  addEmployee(employeeData: any, withLoginDetails: boolean = false) {
    this.elements.addEmployeeButton().click();
    this.elements.employeeInputName("firstName", employeeData.firstName);
    this.elements.employeeInputName("middleName", employeeData.middleName);
    this.elements.employeeInputName("lastName", employeeData.lastName);
    SharedHelper.typeInInputField("Employee Id", employeeData.employeeId);
    if (withLoginDetails) {
      this.elements.createLoginDetails().click({ force: true });
      SharedHelper.typeInInputField("Username", employeeData.username);
      SharedHelper.selectOptionFromList("Status", employeeData.status);
      SharedHelper.typeInInputField("Password", employeeData.password);
      SharedHelper.typeInInputField(
        "Confirm Password",
        employeeData.confirmPassword
      );
    }
    SharedHelper.clickSubmitButtonIsContains("Save");
  }

  editEmployeeByEmpNumber(empNumber: number) {
    cy.visit(`/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`);
  }

  editPersonalDetails(employeeData: any) {
    this.elements.employeeInputName("firstName", employeeData.firstName);
    this.elements.employeeInputName("middleName", employeeData.middleName);
    this.elements.employeeInputName("lastName", employeeData.lastName);
    SharedHelper.typeInInputField("Nickname", employeeData.nickName);
    SharedHelper.typeInInputField("Employee Id", employeeData.employeeId);
    SharedHelper.typeInInputField("Other Id", employeeData.otherId);
    SharedHelper.typeInInputField(
      "Driver's License Number",
      employeeData.drivingLicenseNo
    );
    SharedHelper.selectDateFromCalendar(
      "License Expiry Date",
      employeeData.drivingLicenseExpiredDate
    );
    SharedHelper.typeInInputField("SSN Number", employeeData.ssnNumber);
    SharedHelper.typeInInputField("SIN Number", employeeData.sinNumber);
    SharedHelper.selectItemFromDropdown(
      "Nationality",
      employeeData.nationalityId
    );
    SharedHelper.selectItemFromDropdown(
      "Marital Status",
      employeeData.maritalStatus
    );
    SharedHelper.selectDateFromCalendar("Date of Birth", employeeData.birthday);
    SharedHelper.selectOptionFromList("Gender", employeeData.gender);
    SharedHelper.typeInInputField(
      "Military Service",
      employeeData.militaryService
    );
    SharedHelper.selectOptionFromList("Smoker", employeeData.smoker); // I'm not smoker :D
    SharedHelper.clickSubmitButtonIsContains("Save");
  }

  searchEmployee(id: string) {
    SharedHelper.typeInInputField("Employee Id", id);
    SharedHelper.clickSubmitButtonIsContains("Search");
  }

  openEditMode(id: string) {
    this.searchEmployee(id);
    this.elements.editAction().click();
  }

  deleteEmployee(id: string) {
    this.searchEmployee(id);
    this.elements.deleteAction().click();
    this.elements.deleteBtn().click();
  }
}

export default PimTabActions;
