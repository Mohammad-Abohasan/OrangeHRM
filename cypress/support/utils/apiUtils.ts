import { ICreateCandidatePayload } from "../API/payload/addCandidatePayload";
import { ICreateCandidateResponse } from "../API/response/addCandidateResponse";
import { ICreateVacancyPayload } from "../API/payload/addVacancyPayload";
import { ICreateVacancyResponse } from "../API/response/addVacancyResponse";

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      getCandidatesTableData: (
        method: string,
        url: string
      ) => Chainable<any>;
      addCandidate: (
        method: string,
        url: string,
        payload?: ICreateCandidatePayload
      ) => Chainable<ICreateCandidateResponse>;
      addVacancy: (
        method: string,
        url: string,
        payload?: ICreateVacancyPayload
      ) => Chainable<ICreateVacancyResponse>;
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
