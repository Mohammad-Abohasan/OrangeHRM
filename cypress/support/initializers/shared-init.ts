import { SharedDeletePayload } from "../apis/payload/shared-delete-payload";

export default class SharedInit {
  static initDeleteItem(id: any): SharedDeletePayload {
    const payload = {
      ids: [id],
    };
    return payload;
  }
}
