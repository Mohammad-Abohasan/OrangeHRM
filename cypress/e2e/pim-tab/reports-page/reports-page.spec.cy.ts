import AdminHelper from "../../../support/helpers/admin-tab/admin-helper";
import PimHelper from "../../../support/helpers/pim-tab/pim-helper";
import SharedHelper from "../../../support/helpers/shared-helper";
import ReportsPageActions from "../../../support/page-objects/pim-tab/reports-page/reports-page-actions";
import ReportsPageAssertions from "../../../support/page-objects/pim-tab/reports-page/reports-page-assertions";

const reportsPageActions: ReportsPageActions = new ReportsPageActions();
const reportsPageAssertions: ReportsPageAssertions = new ReportsPageAssertions();
let numberOfEmployees: number = 1;
describe("PIM - Reports: Reports Table Functionality", () => {
  beforeEach(() => {
    // to store the job title and location ids and names for later use instead of get them from fixture every time
    const jobTitle: { [key: string]: number | string } = {};
    const location: { [key: string]: number | string } = {};

    // assign number of employees to be created
    numberOfEmployees = 3;

    cy.loginOrangeHRM();

    cy.fixture("pim-tab/reports-page/reportInfo.json").as("reportData");
    cy.fixture("admin-tab/job-page/jobTitleInfo.json").as("jobData");
    cy.fixture("admin-tab/location-page/locationInfo.json").as("locationData");
    cy.fixture("pim-tab/employeeInfo.json").as("employeeData");
    cy.fixture("pim-tab/employeeJobDetailsInfo.json").as("empJobData");
    cy.fixture("pim-tab/employeeSalaryComponent.json").as("empSalaryData");

    cy.get("@jobData")
      // Add a new job title
      .then((jobData: any) => {
        AdminHelper.addJobTitle(jobData);
      })
      // Save the job title Information
      .then((jobRes: any) => {
        jobTitle.id = jobRes.id;
        jobTitle.title = jobRes.title;
        return cy.get("@locationData");
      })
      // Add a new location
      .then((locationData: any) => {
        return AdminHelper.addLocation(locationData);
      })
      // Save the location Information
      .then((locationRes: any) => {
        location.id = locationRes.id;
        location.name = locationRes.name;
        return cy.get("@employeeData");
      })
      // Add a new employees and update their job details and salary components
      .then((employeeData: any) => {
        Cypress._.times(numberOfEmployees, (count) => {
          const empInfo = { ...employeeData };
          // Add a new employee
          PimHelper.addEmployee(empInfo)
            // Update the employee job details
            .then((empRes: any) => {
              empInfo.empNumber = empRes.empNumber;
              cy.get("@empJobData").then((empJobData: any) => {
                empJobData.jobTitleId = jobTitle.id;
                empJobData.locationId = location.id;
                PimHelper.updateEmployeeJobDetails(empJobData, empInfo.empNumber);
              });
            })
            // Update the employee salary components
            .then(() => {
              return cy.get("@empSalaryData").then((empSalData: any) => {
                return PimHelper.addEmployeeSalaryComponents(
                  empSalData,
                  empInfo.empNumber
                );
              });
            })
            // Save the updated employee information
            .then((empSalRes: any) => {
              empInfo.jobTitle = jobTitle.title;
              empInfo.location = location.name;
              empInfo.salaryAmount = empSalRes.amount;
              return empInfo;
            })
            .as(`employeeNo${count}`);
        });
      })
      // Update the report data with the job title and location
      .then(() => {
        cy.get("@reportData").then((reportData: any) => {
          reportData.name = `${SharedHelper.generateRandomString()}-${
            reportData.name
          }`;
          reportData.criteria["Job Title"] = jobTitle.title;
          reportData.criteria["Location"] = location.name;
        });
      });

    // Save the job title and location ids
    cy.wrap(jobTitle.id).as("jobTitleId");
    cy.wrap(location.id).as("locationId");

    reportsPageActions.openReportsPage();
  });

  it("PIM - Reports - The admin should be able to add a new report and verify it", () => {
    cy.get("@reportData").then((reportData: any) => {
      reportsPageActions.addReport(reportData);
      SharedHelper.checkToastMessage("Successfully Saved");
      SharedHelper.checkLoadingSpinnerIsExist(false);
      
      reportsPageAssertions.verifyReportName(reportData.name);
      reportsPageAssertions.checkTopHeaders(Object.keys(reportData.group));
      reportsPageAssertions.checkReportContents(numberOfEmployees, reportData.group);
      reportsPageAssertions.verifyNumberOfRows(numberOfEmployees);
    });
    cy.url()
      .then((url) => url.split("/").pop()!)
      .as("reportId");
  });

  afterEach(() => {
    // Delete our report via UI
    // reportsPageActions.openReportsPage();
    // cy.get("@reportData").then((reportData: any) => {
    //   reportsPageActions.searchReport(reportData.name);
    //   reportsPageActions.deleteReport();
    //   SharedHelper.checkToastMessage("Successfully Deleted");
    // });
    // Delete our report via API
    cy.get("@reportId").then((reportId: any) => {
      cy.request("DELETE", `/web/index.php/api/v2/pim/reports/defined`, {
        ids: [reportId],
      });
    });
    // Delete our job title via API
    cy.get("@jobTitleId").then((jobTitleId: any) => {
      AdminHelper.deleteJobTitle(jobTitleId);
    });
    // Delete our location via API
    cy.get("@locationId").then((locationId: any) => {
      AdminHelper.deleteLocation(locationId);
    });
    // Delete our employees via API
    Cypress._.times(numberOfEmployees, (count) => {
      cy.get(`@employeeNo${count}`).then((employeeInfo: any) => {
        PimHelper.deleteEmployee(employeeInfo.empNumber);
      });
    });
  });
});
