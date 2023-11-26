import { ICreateCandidatePayload } from "../../../apis/payload/recruitment-tab/candidates-page/add-candidate-payload";
import { IScheduleInterviewPayload } from "../../../apis/payload/recruitment-tab/candidates-page/schedule-interview-payload";

export default class CandidatesInit {
  static initCandidate(
    candidateData: ICreateCandidatePayload,
    vacancyId: number
  ): ICreateCandidatePayload {
    const payload = {
      ...candidateData,
      vacancyId: vacancyId,
    };
    return payload;
  }

  static initScheduleInterview(
    scheduleInterviewData: IScheduleInterviewPayload
  ): IScheduleInterviewPayload {
    const payload = {
      ...scheduleInterviewData,
    };
    return payload;
  }
}
