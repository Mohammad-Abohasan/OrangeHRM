import ClaimTabActions from "../../support/page-objects/claim-tab/claim-tab-actions";
import ClaimTabAssertions from "../../support/page-objects/claim-tab/claim-tab-assertions";
import ClaimHelper from "../../support/helpers/claim-tab/claim-helper";
import AdminHelper from "../../support/helpers/admin-tab/admin-helper";
import PimHelper from "../../support/helpers/pim-tab/pim-helper";
import SharedHelper from "../../support/helpers/shared-helper";

const claimTabActions: ClaimTabActions = new ClaimTabActions();
const claimTabAssertions: ClaimTabAssertions = new ClaimTabAssertions();
describe("Claim: Claim Tab functionality", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();

    cy.fixture("pim-tab/employeeInfo.json").as("employeeData");
    cy.fixture("admin-tab/user-management-page/adminInfo.json").as("empLoginData");
    cy.fixture("claim-tab/claimRequestInfo.json").as("claimReqData");
    cy.fixture("claim-tab/eventInfo.json").as("eventData");

    cy.get("@employeeData")
      // Add an employee
      .then((employeeData: any) => {
        PimHelper.addEmployee(employeeData).then((empResponse: any) => {
          employeeData.firstName = empResponse.firstName;
          cy.wrap(employeeData)
            .as("employeeData")
            .then(() => {
              return empResponse;
            });
        });
      })
      // Add employee's login credentials
      .then((empResponse: any) => {
        cy.wrap(empResponse.empNumber).as("empNumber");
        cy.get("@empLoginData").then((empLoginData: any) => {
          AdminHelper.addAdmin(empLoginData, empResponse.empNumber).then(
            (empLoginResponse: any) => {
              empLoginData.username = empLoginResponse.userName;
              cy.wrap(empLoginData).as("empLoginData");
            }
          );
        });
      })
      // Add an event
      .then(() => {
        cy.get("@eventData").then((eventData: any) => {
          ClaimHelper.addEvent(eventData).then((eventResponse: any) => {
            eventData.eventName = eventResponse.name;
            cy.wrap(eventResponse.id).as("eventId");
            cy.wrap(eventData)
              .as("eventData")
              .then(() => {
                return eventResponse;
              });
          });
        });
      })
      // Login as employee and add a claim request
      .then((eventResponse: any) => {
        cy.logoutOrangeHRM();
        cy.get("@empLoginData").then((empLoginData: any) => {
          cy.loginOrangeHRM(empLoginData.username, empLoginData.password);
          cy.get("@claimReqData").then((claimReqData: any) => {
            return ClaimHelper.addClaimRequest(claimReqData, eventResponse.id);
          });
        });
      })
      // Submit the claim request
      .then((claimReqResponse: any) => {
        cy.wrap(claimReqResponse).as("claimRequest");
        ClaimHelper.submitClaimRequest(claimReqResponse.id);
      })
      // login as admin
      .then(() => {
        cy.logoutOrangeHRM();
        cy.loginOrangeHRM();
        // Prepare the claim request data we need to assert
        cy.get("@employeeData").then((employeeData: any) => {
          cy.get("@claimRequest").then((claimRequest: any) => {
            const employeeClaimReq = {
              employeeName: {
                firstName: employeeData.firstName,
                middleName: employeeData.middleName,
                lastName: employeeData.lastName,
              },
              referenceId: claimRequest.referenceId,
              eventName: claimRequest.claimEvent.name,
              description: claimRequest.remarks,
              currency: claimRequest.currencyType.name,
              submittedDate: claimRequest.referenceId.replace(
                /^(\d{4})(\d{2})(\d{2}).*/,
                "$1-$2-$3"
              ),
              status: "Submitted",
              amount: "0.00",
            };
            cy.wrap(employeeClaimReq).as("employeeClaimReq");
          });
        });
      });
  });

  it("Claim - The admin should be able to approve the employee's claim request, and the employee should be able to view the status of the claim request", () => {
    cy.get("@employeeClaimReq").then((employeeClaimReq: any) => {
      claimTabActions.openClaimTab();
      claimTabActions.openEmployeeClaimsPage();
      claimTabActions.searchClaimRequest(employeeClaimReq);
      SharedHelper.checkLoadingSpinnerIsExist(false);
      claimTabActions.viewDetailsOfClaimRequest();
      claimTabActions.approveClaimRequest();
      employeeClaimReq.status = "Paid";

      cy.logoutOrangeHRM();
      // Login as employee and verify the status of the claim request
      cy.get("@empLoginData").then((empLoginData: any) => {
        cy.loginOrangeHRM(empLoginData.username, empLoginData.password);
        claimTabActions.openClaimTab();
        claimTabActions.searchClaimRequest(employeeClaimReq);
        claimTabAssertions.verifyClaimRequestDetails(employeeClaimReq);
      });
    });
  });

  it("Claim - The admin should be able to reject the employee's claim request, and the employee should be able to view the status of the claim request", () => {
    cy.get("@employeeClaimReq").then((employeeClaimReq: any) => {
      claimTabActions.openClaimTab();
      claimTabActions.openEmployeeClaimsPage();
      claimTabActions.searchClaimRequest(employeeClaimReq);
      SharedHelper.checkLoadingSpinnerIsExist(false);
      claimTabActions.viewDetailsOfClaimRequest();
      claimTabActions.rejectClaimRequest();
      employeeClaimReq.status = "Rejected";

      cy.logoutOrangeHRM();
      // Login as employee and verify the status of the claim request
      cy.get("@empLoginData").then((empLoginData: any) => {
        cy.loginOrangeHRM(empLoginData.username, empLoginData.password);
        claimTabActions.openClaimTab();
        claimTabActions.searchClaimRequest(employeeClaimReq);
        claimTabAssertions.verifyClaimRequestDetails(employeeClaimReq);
      });
    });
  });

  afterEach(() => {
    cy.logoutOrangeHRM();
    // Login as admin
    cy.loginOrangeHRM();
    // Delete the employee
    cy.get("@empNumber").then((empNumber: any) => {
      PimHelper.deleteEmployee(empNumber);
    });
    // Delete the event
    cy.get("@eventId").then((eventId: any) => {
      ClaimHelper.deleteEvent(eventId);
    });
  });
});
