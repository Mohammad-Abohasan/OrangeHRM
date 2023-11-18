export interface IActionOnClaimRequestResponse {
  data: Data;
  meta: any[];
  rels: any[];
}

export interface Data {
  id: number;
  referenceId: string;
  claimEvent: ClaimEvent;
  currencyType: CurrencyType;
  remarks: string;
  status: string;
}

export interface ClaimEvent {
  id: number;
  name: string;
  status: boolean;
  isDeleted: boolean;
}

export interface CurrencyType {
  id: string;
  name: string;
}
