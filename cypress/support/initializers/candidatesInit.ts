import { ICreateCandidatePayload } from "../API/payload/addCandidatePayload";

export default class Candidates {
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
