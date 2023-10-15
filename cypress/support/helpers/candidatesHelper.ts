import { ICreateCandidatePayload } from "../API/payload/Recruitment/Candidates/addCandidatePayload";
import CandidatesInit from "../initializers/candidatesInit";

export const URLs = {
  candidatesData: `/web/index.php/api/v2/recruitment/candidates?limit=50`,
  candidates: `/web/index.php/api/v2/recruitment/candidates`,
};

export default class Candidates {
  static getCandidatesTableDataUsingAPI() {
    return cy.getCandidatesTableData("GET", URLs.candidatesData);
  }
  static addCandidate(
    candidateData: ICreateCandidatePayload,
    vacancyId: number
  ) {
    return cy.addCandidate(
      "POST",
      URLs.candidates,
      CandidatesInit.initCandidate(candidateData, vacancyId)
    );
  }
  static shortlistCandidate(candidateId: number) {
    return cy.shortlistCandidate(
      "PUT",
      `${URLs.candidates}/${candidateId}/shortlist`
    );
  }
}
