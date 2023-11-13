import SharedHelper from "../../helpers/shared-helper";

class PimTabActions {
  elements = {
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
    SharedHelper.addButton().click({force: true});
    this.elements.employeeInputName("firstName", employeeData.firstName);
    this.elements.employeeInputName("middleName", employeeData.middleName);
    this.elements.employeeInputName("lastName", employeeData.lastName);
    SharedHelper.fillInInputField("Employee Id", employeeData.employeeId);
    if (withLoginDetails) {
      this.elements.createLoginDetails().click({ force: true });
      SharedHelper.fillInInputField("Username", employeeData.username);
      SharedHelper.fillInInputField("PIM - Status", employeeData.status);
      SharedHelper.fillInInputField("Password", employeeData.password);
      SharedHelper.fillInInputField(
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
    SharedHelper.fillInInputField("Nickname", employeeData.nickName);
    SharedHelper.fillInInputField("Employee Id", employeeData.employeeId);
    SharedHelper.fillInInputField("Other Id", employeeData.otherId);
    SharedHelper.fillInInputField(
      "Driver's License Number",
      employeeData.drivingLicenseNo
    );
    SharedHelper.fillInInputField(
      "License Expiry Date",
      employeeData.drivingLicenseExpiredDate
    );
    SharedHelper.fillInInputField("SSN Number", employeeData.ssnNumber);
    SharedHelper.fillInInputField("SIN Number", employeeData.sinNumber);
    SharedHelper.fillInInputField(
      "Nationality",
      employeeData.nationalityId
    );
    SharedHelper.fillInInputField(
      "Marital Status",
      employeeData.maritalStatus
    );
    SharedHelper.fillInInputField("Date of Birth", employeeData.birthday);
    SharedHelper.fillInInputField("Gender", employeeData.gender);
    SharedHelper.fillInInputField(
      "Military Service",
      employeeData.militaryService
    );
    SharedHelper.fillInInputField("Smoker", employeeData.smoker); // I'm not smoker :D
    SharedHelper.clickSubmitButtonIsContains("Save");
  }

  searchEmployee(id: string) {
    SharedHelper.fillInInputField("Employee Id", id);
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
