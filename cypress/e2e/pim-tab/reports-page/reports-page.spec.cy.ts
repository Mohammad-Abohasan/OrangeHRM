import { cleanupEntities, prepareReport } from "../../../support/helpers/pim-tab/reports-page/reports-helper";
import SharedHelper from "../../../support/helpers/shared-helper";
import ReportsPageActions from "../../../support/page-objects/pim-tab/reports-page/reports-page-actions";
import ReportsPageAssertions from "../../../support/page-objects/pim-tab/reports-page/reports-page-assertions";

const reportsPageActions: ReportsPageActions = new ReportsPageActions();
const reportsPageAssertions: ReportsPageAssertions = new ReportsPageAssertions();

let numberOfEmployees: number = 1;
let reportData: any = {};
let jobData: any = {};
let locationData: any = {};
let employeesData: any = [];

describe("PIM - Reports: Reports Table Functionality", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();
    
    numberOfEmployees = 3;
    prepareReport(numberOfEmployees).then((preparedData: any) => {
      reportData = preparedData.reportData;
      jobData = preparedData.jobData;
      locationData = preparedData.locationData;
      employeesData = preparedData.employeesData;
    });
    reportsPageActions.openReportsPage();
  });

  it("Reports - The admin should be able to add a new report and verify it", () => {
    reportsPageActions.addReport(reportData);
    SharedHelper.checkToastMessage("Successfully Saved");
    SharedHelper.waitUntilItFinished();

    reportsPageAssertions.verifyReportName(reportData.name);
    reportsPageAssertions.checkTopHeaders(Object.keys(reportData.group));
    reportsPageAssertions.checkReportContents(employeesData, reportData.group);
    reportsPageAssertions.verifyNumberOfRows(numberOfEmployees);

    cy.url().then((url) => (reportData.id = url.split("/").pop()!));
  });

  afterEach(() => {
    cleanupEntities(reportData.id, jobData.id, locationData.id, employeesData);
  });
});
