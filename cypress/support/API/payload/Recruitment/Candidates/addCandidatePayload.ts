export interface ICreateCandidatePayload {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  keywords: string;
  comment: string;
  dateOfApplication: string;
  consentToKeepData: boolean;
  vacancyId: number;
}
