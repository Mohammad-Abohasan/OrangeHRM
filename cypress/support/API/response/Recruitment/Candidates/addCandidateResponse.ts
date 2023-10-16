export interface ICreateCandidateResponse {
  data: {
    id: number;
    name: string;
    description: string;
    numOfPositions: number;
    status: boolean;
    isPublished: boolean;
    jobTitle: {
      id: number;
      title: string;
      isDeleted: boolean;
    };
    hiringManager: {
      id: number;
      firstName: string;
      middleName: string;
      lastName: string;
      terminationId: number;
    };
  };
  meta: [];
  rels: [];
}
