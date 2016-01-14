import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import DevTools from "./monitors/DevTools";
import rootReducer from "./reducers";

// a list of middlewares we want to use
const middleware = [thunk];

// create a store creator
const createStoreWithMiddleware = compose(
  // place any store enhancers here if you want to handle thunks etc.
  applyMiddleware(...middleware),
  DevTools.instrument()

  // a custom store enhancer:
  //
  //   (next) => (reducer, initialState) => {
  //     let store = next(reducer, initialState);
  //     store.subscribe(() => {
  //       console.log("STATE CHANGED", store.getState());
  //     });
  //     return store;
  //   }
)(createStore);

export function configureStore(initialState) {
  let store = createStoreWithMiddleware(
    rootReducer,
    initialState
  );

  if (module.hot) {
    module.hot.accept("./reducers", () => {
      const nextRootReducer = require("./reducers").default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
