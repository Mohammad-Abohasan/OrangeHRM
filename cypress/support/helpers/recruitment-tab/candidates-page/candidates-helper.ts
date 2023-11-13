import { ICreateCandidatePayload } from "../../../apis/payload/recruitment-tab/candidates-page/add-candidate-payload";
import CandidatesInit from "../../../initializers/recruitment-tab/candidates-page/candidates-init";
import SharedInit from "../../../initializers/shared-init";

export const URLs = {
  candidatesData: `/web/index.php/api/v2/recruitment/candidates?limit=50`,
  candidates: `/web/index.php/api/v2/recruitment/candidates`,
};

export default class CandidatesHelper {
  static getCandidatesTableDataUsingAPI() {
    return cy.getCandidatesTableData("GET", URLs.candidatesData);
  }

  static addCandidate(candidateData: ICreateCandidatePayload, vacancyId: number) {
    return cy
      .addCandidate(
        "POST",
        URLs.candidates,
        CandidatesInit.initCandidate(candidateData, vacancyId)
      )
      .then((response) => response.data);
  }

  static shortlistCandidate(candidateId: number) {
    return cy.shortlistCandidate(
      "PUT",
      `${URLs.candidates}/${candidateId}/shortlist`
    );
  }

  static deleteCandidate(candidateId: number) {
    return cy.deleteItem(
      "DELETE",
      URLs.candidates,
      SharedInit.initDeleteItem(candidateId)
    );
  }
}
