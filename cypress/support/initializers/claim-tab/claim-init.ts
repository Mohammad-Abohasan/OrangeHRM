import { IActionOnClaimRequestPayload } from "../../apis/payload/claim-tab/action-on-claim-request-payload";
import { ICreateClaimRequestPayload } from "../../apis/payload/claim-tab/add-claim-request-payload";
import { ICreateEventPayload } from "../../apis/payload/claim-tab/add-event-payload";
import SharedHelper from "../../helpers/shared-helper";

export default class ClaimInit {
  static initAddEvent(eventData: ICreateEventPayload): ICreateEventPayload {
    const payload = {
      ...eventData,
      name: `${eventData.name} - ${SharedHelper.generateRandomString(2, 5)}`,
    };
    return payload;
  }

  static initAddClaimRequest(
    claimRequestData: ICreateClaimRequestPayload,
    eventId: number
  ): ICreateClaimRequestPayload {
    const payload = {
      ...claimRequestData,
      claimEventId: eventId,
    };
    return payload;
  }

  static initActionOnClaimRequest(
    actionData: IActionOnClaimRequestPayload
  ): IActionOnClaimRequestPayload {
    const payload = {
      ...actionData,
    };
    return payload;
  }
}
