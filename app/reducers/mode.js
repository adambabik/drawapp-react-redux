import { DRAW_RECT_MODE } from "../constants";

export default function mode(state = DRAW_RECT_MODE, action) {
  switch (action.type) {
    case "CHANGE_MODE":
      return action.payload;
    default:
      return state;
  }
}
