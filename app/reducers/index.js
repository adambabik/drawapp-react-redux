import { combineReducers } from "redux";
import items from "./items";
import mode from "./mode";
import sync from "./sync";

export default combineReducers({
  items,
  mode,
  sync
});
