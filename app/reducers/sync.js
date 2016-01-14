import { Map } from "immutable";

const initialState = new Map({ syncing: false, error: null })

export default function sync(state = initialState, action) {
  switch(action.type) {
    case "REQUEST_SAVE_STATE":
      return state
        .set("syncing", true)
        .set("error", null);
    case "REQUEST_SAVE_STATE_FINISHED":
      return state
        .set("syncing", false)
        .set("error", action.payload === true ? null : action.payload);
    default:
      return state;
  }
}
