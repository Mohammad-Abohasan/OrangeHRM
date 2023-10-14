export interface ICreateVacancyPayload {
  name: string;
  jobTitleId: number;
  numOfPositions: number;
  description: string;
  status: boolean;
  isPublished: boolean;
}
