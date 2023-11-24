import ClaimTabActions from "../../support/page-objects/claim-tab/claim-tab-actions";
import ClaimTabAssertions from "../../support/page-objects/claim-tab/claim-tab-assertions";
import ClaimHelper from "../../support/helpers/claim-tab/claim-helper";
import AdminHelper from "../../support/helpers/admin-tab/admin-helper";
import PimHelper from "../../support/helpers/pim-tab/pim-helper";
import SharedHelper from "../../support/helpers/shared-helper";

const claimTabActions: ClaimTabActions = new ClaimTabActions();
const claimTabAssertions: ClaimTabAssertions = new ClaimTabAssertions();

let employeeData: any = {};
let empLoginData: any = {};
let claimReqData: any = {};
let eventData: any = {};

describe("Claim: Claim Tab functionality", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();
    cy.fixture("pim-tab/employeeInfo.json")
      .then((employeeInfo: any) => {
        employeeData = employeeInfo;
        cy.fixture("admin-tab/user-management-page/adminInfo.json");
      })
      .then((adminInfo: any) => {
        empLoginData = adminInfo;
        cy.fixture("claim-tab/claimRequestInfo.json");
      })
      .then((claimRequestInfo: any) => {
        claimReqData = claimRequestInfo;
        cy.fixture("claim-tab/eventInfo.json");
      })
      // Add an employee
      .then((eventInfo: any) => {
        eventData = eventInfo;
        PimHelper.addEmployee(employeeData);
      })
      // Add employee's login credentials
      .then((empResponse: any) => {
        employeeData.firstName = empResponse.firstName;
        employeeData.empNumber = empResponse.empNumber;
        AdminHelper.addAdmin(empLoginData, empResponse.empNumber);
      })
      // Add an event
      .then((empLoginResponse: any) => {
        empLoginData.username = empLoginResponse.userName;
        ClaimHelper.addEvent(eventData);
      })
      // Login as employee and add a claim request
      .then((eventResponse: any) => {
        eventData.id = eventResponse.id;
        eventData.eventName = eventResponse.name;
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM(empLoginData.username, empLoginData.password);
        ClaimHelper.addClaimRequest(claimReqData, eventResponse.id);
      })
      // Submit the claim request and store claim request details to verify later
      .then((claimReqRes: any) => {
        claimReqData.employeeName = (({ firstName, middleName, lastName }) => ({
          firstName,
          middleName,
          lastName,
        }))(employeeData);
        claimReqData.referenceId = claimReqRes.referenceId;
        claimReqData.eventName = claimReqRes.claimEvent.name;
        claimReqData.description = claimReqRes.remarks;
        claimReqData.currency = claimReqRes.currencyType.name;
        claimReqData.submittedDate = claimReqRes.referenceId.replace(
          /^(\d{4})(\d{2})(\d{2}).*/,
          "$1-$2-$3"
        );
        claimReqData.amount = "0.00";
        ClaimHelper.submitClaimRequest(claimReqRes.id);
      })
      // login as admin
      .then((submitClaimRes: any) => {
        claimReqData.status = `${submitClaimRes.status[0]}${submitClaimRes.status
          .slice(1)
          .toLowerCase()}`;
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM();
      });
    claimTabActions.openClaimTab();
  });

  it("Claim - The admin should be able to approve the employee's claim request, and the employee should be able to view the status of the claim request", () => {
    claimTabActions.openEmployeeClaimsPage();
    claimTabActions.searchClaimRequest(claimReqData);
    SharedHelper.waitUntilItFinished();
    claimTabActions.viewDetailsOfClaimRequest();
    claimTabActions.approveClaimRequest();
    claimReqData.status = "Paid";
    cy.logoutOrangeHRM();

    // Login as employee and verify the status of the claim request
    cy.loginOrangeHRM(empLoginData.username, empLoginData.password);
    claimTabActions.openClaimTab();
    claimTabActions.searchClaimRequest(claimReqData);
    claimTabAssertions.verifyClaimRequestDetails(claimReqData);
  });

  it("Claim - The admin should be able to reject the employee's claim request, and the employee should be able to view the status of the claim request", () => {
    claimTabActions.openEmployeeClaimsPage();
    claimTabActions.searchClaimRequest(claimReqData);
    SharedHelper.waitUntilItFinished();
    claimTabActions.viewDetailsOfClaimRequest();
    claimTabActions.rejectClaimRequest();
    claimReqData.status = "Rejected";
    cy.logoutOrangeHRM();

    // Login as employee and verify the status of the claim request
    cy.loginOrangeHRM(empLoginData.username, empLoginData.password);
    claimTabActions.openClaimTab();
    claimTabActions.searchClaimRequest(claimReqData);
    claimTabAssertions.verifyClaimRequestDetails(claimReqData);
  });

  afterEach(() => {
    cy.logoutOrangeHRM();
    // Login as admin
    cy.loginOrangeHRM();
    PimHelper.deleteEmployee(employeeData.empNumber);
    ClaimHelper.deleteEvent(eventData.id);
  });
});
