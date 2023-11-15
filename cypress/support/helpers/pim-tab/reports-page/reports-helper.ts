import SharedInit from "../../../initializers/shared-init";
import AdminHelper from "../../admin-tab/admin-helper";
import SharedHelper from "../../shared-helper";
import PimHelper from "../pim-helper";

export const URLs = {
  reports: `/web/index.php/api/v2/pim/reports/defined`,
};

export const prepareReport = (numberOfEmployees: number = 1) => {
  let reportData: any = {};
  let jobData: any = {};
  let locationData: any = {};
  let employeeData: any = {};
  let employeesData: any = [];
  let empJobData: any = {};
  let empSalData: any = {};

  const prepare = () => {
    cy.fixture("pim-tab/reports-page/reportInfo.json")
      .then((reportInfo: any) => {
        reportData = reportInfo;
        cy.fixture("admin-tab/job-page/jobTitleInfo.json");
      })
      .then((jobInfo: any) => {
        jobData = jobInfo;
        cy.fixture("admin-tab/location-page/locationInfo.json");
      })
      .then((locationInfo: any) => {
        locationData = locationInfo;
        cy.fixture("pim-tab/employeeInfo.json");
      })
      .then((employeeInfo: any) => {
        employeeData = employeeInfo;
        cy.fixture("pim-tab/employeeJobDetailsInfo.json");
      })
      .then((empJobInfo: any) => {
        empJobData = empJobInfo;
        cy.fixture("pim-tab/employeeSalaryComponent.json");
      })
      // Add a new job title
      .then((empSalaryInfo: any) => {
        empSalData = empSalaryInfo;
        AdminHelper.addJobTitle(jobData);
      })
      // Add a new location
      .then((jobRes: any) => {
        jobData.id = jobRes.id;
        jobData.title = jobRes.title;
        AdminHelper.addLocation(locationData);
      })
      // Add a new employees and update their job details and salary components
      .then((locationRes: any) => {
        locationData.id = locationRes.id;
        locationData.name = locationRes.name;
        Cypress._.times(numberOfEmployees, () => {
          // Copy the employee data to a new employee
          const empInfo = { ...employeeData };
          // Add a new employee
          PimHelper.addEmployee(empInfo)
            // Update the employee job details and Add a new salary component
            .then((empRes: any) => {
              empInfo.empNumber = empRes.empNumber;
              empInfo.firstName = empRes.firstName;
              empJobData.jobTitleId = jobData.id;
              empJobData.locationId = locationData.id;
              PimHelper.updateEmployeeJobDetails(empJobData, empInfo.empNumber);
              PimHelper.addEmployeeSalaryComponents(empSalData, empInfo.empNumber);
            })
            // Save employee data
            .then((empSalRes: any) => {
              empInfo.jobTitle = jobData.title;
              empInfo.location = locationData.name;
              empInfo.salaryAmount = empSalRes.amount;
              employeesData.push(empInfo);
            });
        });
      })
      // Update the report data with the job title and location
      .then(() => {
        reportData.name += ` - ${SharedHelper.generateRandomString()}`;
        reportData.criteria["Job Title"] = jobData.title;
        reportData.criteria["Location"] = locationData.name;
      });
  };

  return cy.wrap(prepare()).then(() => ({
    reportData,
    jobData,
    locationData,
    employeesData,
    empJobData,
    empSalData,
  }));
};

export const reportToEmployeeFieldAdapter: { [key: string]: string } = {
  "Employee First Name": "firstName",
  "Job Title": "jobTitle",
  Amount: "salaryAmount",
};

export const cleanupEntities = (
  reportId: any,
  jobId: any,
  locationId: any,
  employeesData: any
) => {
  ReportsHelper.deleteReport(reportId);
  AdminHelper.deleteJobTitle(jobId);
  AdminHelper.deleteLocation(locationId);
  Cypress._.each(employeesData, (employee) => {
    PimHelper.deleteEmployee(employee.empNumber);
  });
};

export default class ReportsHelper {
  static deleteReport(reportId: number) {
    return cy.deleteItem(
      "DELETE",
      URLs.reports,
      SharedInit.initDeleteItem(reportId)
    );
  }
}
