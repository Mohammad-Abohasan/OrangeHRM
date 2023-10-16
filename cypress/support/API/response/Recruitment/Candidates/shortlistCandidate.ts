export interface IShortlistCandidateResponse {
  data: {
    id: number;
    candidate: {
      id: number;
      firstName: string;
      middleName: string;
      lastName: string;
    };
    vacancy: {
      id: string;
      name: string;
      hiringManager: {
        empNumber: number;
        firstName: string;
        middleName: string;
        lastName: string;
        terminationId: number;
      };
    };
    note: string;
    action: {
      id: number;
      label: string;
    };
  };
  meta: [];
  rels: [];
}
