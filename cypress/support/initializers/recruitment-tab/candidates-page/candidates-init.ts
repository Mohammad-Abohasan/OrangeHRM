import { ICreateCandidatePayload } from "../../../apis/payload/recruitment-tab/candidates-page/add-candidate-payload";

export default class CandidatesInit {
  static initCandidate(
    candidateData: ICreateCandidatePayload,
    vacancyId: number
  ): ICreateCandidatePayload {
    const payload = {
      ...candidateData,
      "vacancyId": vacancyId,
    };
    return payload;
  }
}
