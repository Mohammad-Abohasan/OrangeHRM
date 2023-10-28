import { ICreateCandidatePayload } from "../../../apis/payload/recruitmentTab/candidatesPage/addCandidatePayload";

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
