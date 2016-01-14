import { handleActions } from "redux-actions";
import { List } from "immutable";

const findById = (searched) => (item) => searched.id === item.id;

export default handleActions({
  "ADD_ITEM": (state, action) => {
    // without Immutable:
    //
    //   `state.concat([action.payload])`
    //
    return state.push(action.payload);
  },

  "CHANGE_ITEM": (state, action) => {
    // without Immutable:
    //
    //   `[...state.slice(0, idx), action.payload, ...state.slice(idx + 1)]`
    //
    return state.set(
      state.findIndex(findById(action.payload)),
      action.payload
    );
  },

  "REMOVE_ITEM": (state, action) => {
    // without Immutable
    //
    //   `[...state.slice(0, idx), ...state.slice(idx + 1)]`
    //
    return state.delete(
      state.findIndex(findById(action.payload))
    );
  }
}, new List());
