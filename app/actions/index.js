import { createAction } from "redux-actions";
import fetch from "isomorphic-fetch";

const createDescriptiveAction = (type, ...args) => {
  let action = createAction(type, ...args);
  action.toString = () => type;
  return action;
};

// items
export const addItem = createDescriptiveAction("ADD_ITEM");
export const changeItem = createDescriptiveAction("CHANGE_ITEM");
export const removeItem = createDescriptiveAction("REMOVE_ITEM");


// mode
export function changeMode(mode) {
  return {
    type: "CHANGE_MODE",
    payload: mode
  }
}


// sync
export function requestSaveState() {
  return {
    type: "REQUEST_SAVE_STATE"
  };
}

export function requstSaveStateFinished(result) {
  return {
    type: "REQUEST_SAVE_STATE_FINISHED",
    payload: result
  };
}

// Only with arrow functions:
//
//   `const saveState = (state) => (dispatch) => { ... }`
//
export function saveState(state) {
  return (dispatch) => {
    return fetch(
      "/api/state",
      {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(state)
      })
      .then(() => dispatch(requstSaveStateFinished(true)))
      .catch((err) => dispatch(requstSaveStateFinished(err.message)));
  };
}
