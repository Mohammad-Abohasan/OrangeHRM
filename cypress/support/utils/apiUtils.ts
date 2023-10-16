import { ICreateCandidatePayload } from "../API/payload/Recruitment/Candidates/addCandidatePayload";
import { ICreateCandidateResponse } from "../API/response/Recruitment/Candidates/addCandidateResponse";
import { ICreateVacancyPayload } from "../API/payload/Recruitment/Vacancies/addVacancyPayload";
import { ICreateVacancyResponse } from "../API/response/Recruitment/Vacancies/addVacancyResponse";
import { IShortlistCandidateResponse } from "../API/response/Recruitment/Candidates/shortlistCandidate";
import { ICreateEmployeeResponse } from "../API/response/PIM/addEmployeeResponse";
import { ICreateEmployeePayload } from "../API/payload/PIM/addEmployeePayload";
import { IGetEmployeeResponse } from "../API/response/PIM/getEmployeeResponse";
import { IDeleteEmployeeResponse } from "../API/response/PIM/deleteEmployeeResponse";
import { IDeleteEmployeePayload } from "../API/payload/PIM/deleteEmployeePayload";
import { ICreateAdminPayload } from "../API/payload/Admin/addAdminPayload";
import { ICreateAdminResponse } from "../API/response/Admin/addAdminResponse";

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
    }
  }
}

const apiCall = (method: string, url: string, payload?: any) => {
  const restAPI: any = {
    GET: { response: 200 },
    POST: { response: 200 || 201 },
    PUT: { response: 200 },
    DELETE: { response: 200 },
  };
  return cy
    .request({
      method,
      url,
      body: payload,
    })
    .then((response) => {
      expect(response.status).to.eq(restAPI[method].response);
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
