import AdminHelper from "../../../support/helpers/admin-tab/admin-helper";
import PimHelper from "../../../support/helpers/pim-tab/pim-helper";
import SharedHelper from "../../../support/helpers/shared-helper";
import ReportsPageActions from "../../../support/page-objects/pim-tab/reports-page/reports-page-actions";
import ReportsPageAssertions from "../../../support/page-objects/pim-tab/reports-page/reports-page-assertions";

const reportsPageActions: ReportsPageActions = new ReportsPageActions();
const reportsPageAssertions: ReportsPageAssertions = new ReportsPageAssertions();

let numberOfEmployees: number = 1;
let reportData: any = {};
let jobData: any = {};
let locationData: any = {};
let employeeData: any = {};
let employeesData: any = [];
let empJobData: any = {};
let empSalData: any = {};

describe("PIM - Reports: Reports Table Functionality", () => {
  beforeEach(() => {
    // assign number of employees to be created
    numberOfEmployees = 3;

    cy.loginOrangeHRM();
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

    reportsPageActions.openReportsPage();
  });

  it("PIM - Reports - The admin should be able to add a new report and verify it", () => {
    reportsPageActions.addReport(reportData);
    SharedHelper.checkToastMessage("Successfully Saved");
    SharedHelper.checkLoadingSpinnerIsExist(false);

    reportsPageAssertions.verifyReportName(reportData.name);
    reportsPageAssertions.checkTopHeaders(Object.keys(reportData.group));
    reportsPageAssertions.checkReportContents(employeesData, reportData.group);
    reportsPageAssertions.verifyNumberOfRows(numberOfEmployees);

    cy.url().then((url) => (reportData.id = url.split("/").pop()!));
  });

  afterEach(() => {
    // Delete our report via UI
    // reportsPageActions.openReportsPage();
    // reportsPageActions.searchReport(reportData.name);
    // reportsPageActions.deleteReport();
    // SharedHelper.checkToastMessage("Successfully Deleted");

    // Delete our report via API
    PimHelper.deleteReport(reportData.id);
    AdminHelper.deleteJobTitle(jobData.id);
    AdminHelper.deleteLocation(locationData.id);
    Cypress._.times(numberOfEmployees, (count) => {
      PimHelper.deleteEmployee(employeesData[count].empNumber);
    });
  });
});
