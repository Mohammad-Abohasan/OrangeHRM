import { ICreateCandidatePayload } from "../apis/payload/recruitmentTab/candidatesPage/addCandidatePayload";
import { ICreateCandidateResponse } from "../apis/response/recruitmentTab/candidatesPage/addCandidateResponse";
import { ICreateVacancyPayload } from "../apis/payload/recruitmentTab/vacanciesPage/addVacancyPayload";
import { ICreateVacancyResponse } from "../apis/response/recruitmentTab/vacanciesPage/addVacancyResponse";
import { IShortlistCandidateResponse } from "../apis/response/recruitmentTab/candidatesPage/shortlistCandidate";
import { ICreateEmployeeResponse } from "../apis/response/pimTab/addEmployeeResponse";
import { ICreateEmployeePayload } from "../apis/payload/pimTab/addEmployeePayload";
import { IGetEmployeeResponse } from "../apis/response/pimTab/getEmployeeResponse";
import { IDeleteEmployeeResponse } from "../apis/response/pimTab/deleteEmployeeResponse";
import { IDeleteEmployeePayload } from "../apis/payload/pimTab/deleteEmployeePayload";
import { ICreateAdminPayload } from "../apis/payload/adminTab/userManagementPage/addAdminPayload";
import { ICreateAdminResponse } from "../apis/response/adminTab/userManagementPage/addAdminResponse";
import { IAddLeaveEntitlementPayload } from "../apis/payload/leaveTab/entitlementsPage/addLeaveEntitlementPayload";
import { IAddLeaveEntitlementResponse } from "../apis/response/leaveTab/entitlementsPage/addLeaveEntitlementResponse";
import { IApplyLeavePayload } from "../apis/payload/leaveTab/applyPage/applyLeavePayload";
import { IApplyLeaveResponse } from "../apis/response/leaveTab/applyPage/applyLeaveResponse";
import { IActionOnLeaveRequestPayload } from "../apis/payload/leaveTab/leaveListPage/actionOnLeaveRequestPayload";
import { IActionOnLeaveRequestResponse } from "../apis/response/leaveTab/leaveListPage/actionOnLeaveRequestResponse";

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

      getEmployee: (
        method: string,
        url: string
      ) => Chainable<IGetEmployeeResponse>;

      deleteEmployee: (
        method: string,
        url: string,
        payload: IDeleteEmployeePayload
      ) => Chainable<IDeleteEmployeeResponse>;

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
Cypress.Commands.add("deleteEmployee", apiCall);
Cypress.Commands.add("addAdmin", apiCall);
Cypress.Commands.add("addLeaveEntitlement", apiCall);
Cypress.Commands.add("applyLeave", apiCall);
Cypress.Commands.add("actionOnLeaveRequest", apiCall);
