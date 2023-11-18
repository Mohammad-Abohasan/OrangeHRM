import { ICreateCandidatePayload } from "../apis/payload/recruitment-tab/candidates-page/add-candidate-payload";
import { ICreateCandidateResponse } from "../apis/response/recruitment-tab/candidates-page/add-candidate-response";
import { ICreateVacancyPayload } from "../apis/payload/recruitment-tab/vacancies-page/add-vacancy-payload";
import { ICreateVacancyResponse } from "../apis/response/recruitment-tab/vacancies-page/add-vacancy-response";
import { IShortlistCandidateResponse } from "../apis/response/recruitment-tab/candidates-page/shortlist-candidate";
import { ICreateEmployeeResponse } from "../apis/response/pim-tab/add-employee-response";
import { ICreateEmployeePayload } from "../apis/payload/pim-tab/add-employee-payload";
import { IGetEmployeeResponse } from "../apis/response/pim-tab/get-employee-response";
import { ICreateAdminPayload } from "../apis/payload/admin-tab/user-management-page/add-admin-payload";
import { ICreateAdminResponse } from "../apis/response/admin-tab/user-management-page/add-admin-response";
import { IAddLeaveEntitlementPayload } from "../apis/payload/leave-tab/entitlements-page/add-leave-entitlement-payload";
import { IAddLeaveEntitlementResponse } from "../apis/response/leave-tab/entitlement-page/add-leave-entitlement-response";
import { IApplyLeavePayload } from "../apis/payload/leave-tab/apply-page/apply-leave-payload";
import { IApplyLeaveResponse } from "../apis/response/leave-tab/apply-page/apply-leave-response";
import { IActionOnLeaveRequestPayload } from "../apis/payload/leave-tab/leave-list-page/action-on-leave-request-payload";
import { IActionOnLeaveRequestResponse } from "../apis/response/leave-tab/leave-list-page/action-on-leave-request-response";
import { SharedDeletePayload } from "../apis/payload/shared-delete-payload";
import { SharedDeleteResponse } from "../apis/response/shared-delete-response";
import { ICreateLocationPayload } from "../apis/payload/admin-tab/location-page/add-location-payload";
import { ICreateLocationResponse } from "../apis/response/admin-tab/location-page/add-location-response";
import { ICreateJobTitlePayload } from "../apis/payload/admin-tab/job-page/add-jobTitle-payload";
import { ICreateJobTitleResponse } from "../apis/response/admin-tab/job-page/add-jobTitle-response";
import { IUpdateEmployeeJobDetailsResponse } from "../apis/response/pim-tab/update-employee-job-details-response";
import { IUpdateEmployeeJobDetailsPayload } from "../apis/payload/pim-tab/update-employee-job-details-payload";
import { ICreateEmployeeSalaryComponentsResponse } from "../apis/response/pim-tab/add-employee-salary-components-response";
import { ICreateEmployeeSalaryComponentsPayload } from "../apis/payload/pim-tab/add-employee-salary-components-payload";

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      getCandidatesTableData: (method: string, url: string) => Chainable<any>;

      addCandidate: (
        method: string,
        url: string,
        payload: ICreateCandidatePayload
      ) => Chainable<ICreateCandidateResponse>;

      addVacancy: (
        method: string,
        url: string,
        payload: ICreateVacancyPayload
      ) => Chainable<ICreateVacancyResponse>;

      shortlistCandidate: (
        method: string,
        url: string
      ) => Chainable<IShortlistCandidateResponse>;

      addEmployee: (
        method: string,
        url: string,
        payload: ICreateEmployeePayload
      ) => Chainable<ICreateEmployeeResponse>;

      getEmployee: (method: string, url: string) => Chainable<IGetEmployeeResponse>;

      deleteItem: (
        method: string,
        url: string,
        payload: SharedDeletePayload
      ) => Chainable<SharedDeleteResponse>;

      addAdmin: (
        method: string,
        url: string,
        payload: ICreateAdminPayload
      ) => Chainable<ICreateAdminResponse>;

      addLeaveEntitlement: (
        method: string,
        url: string,
        payload: IAddLeaveEntitlementPayload
      ) => Chainable<IAddLeaveEntitlementResponse>;

      applyLeave: (
        method: string,
        url: string,
        payload: IApplyLeavePayload
      ) => Chainable<IApplyLeaveResponse>;

      actionOnLeaveRequest: (
        method: string,
        url: string,
        payload: IActionOnLeaveRequestPayload
      ) => Chainable<IActionOnLeaveRequestResponse>;

      addJobTitle: (
        method: string,
        url: string,
        payload: ICreateJobTitlePayload
      ) => Chainable<ICreateJobTitleResponse>;

      addLocation: (
        method: string,
        url: string,
        payload: ICreateLocationPayload
      ) => Chainable<ICreateLocationResponse>;

      updateEmployeeJobDetails: (
        method: string,
        url: string,
        payload: IUpdateEmployeeJobDetailsPayload
      ) => Chainable<IUpdateEmployeeJobDetailsResponse>;

      addEmployeeSalaryComponents: (
        method: string,
        url: string,
        payload: ICreateEmployeeSalaryComponentsPayload
      ) => Chainable<ICreateEmployeeSalaryComponentsResponse>;
    }
  }
}

const apiCall = (method: string, url: string, payload?: any) => {
  return cy
    .request({
      method,
      url,
      body: payload,
    })
    .then((response) => {
      return response;
    })
    .its("body");
};

Cypress.Commands.add("getCandidatesTableData", apiCall);
Cypress.Commands.add("addCandidate", apiCall);
Cypress.Commands.add("addVacancy", apiCall);
Cypress.Commands.add("shortlistCandidate", apiCall);
Cypress.Commands.add("addEmployee", apiCall);
Cypress.Commands.add("getEmployee", apiCall);
Cypress.Commands.add("deleteItem", apiCall);
Cypress.Commands.add("addAdmin", apiCall);
Cypress.Commands.add("addLeaveEntitlement", apiCall);
Cypress.Commands.add("applyLeave", apiCall);
Cypress.Commands.add("actionOnLeaveRequest", apiCall);
Cypress.Commands.add("addJobTitle", apiCall);
Cypress.Commands.add("addLocation", apiCall);
Cypress.Commands.add("updateEmployeeJobDetails", apiCall);
Cypress.Commands.add("addEmployeeSalaryComponents", apiCall);
