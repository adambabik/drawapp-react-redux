import style from "./app.scss";
import React from "react";
import { Provider } from "react-redux";
import { APP_HTML_ID } from "../constants";
import { configureStore } from "../configure-store";
import Canvas from "./Canvas";
import MousePosition from "./MousePosition";
import Toolbar from "./Toolbar";
import DevTools from "../monitors/DevTools";
import { mapRawItems } from "./items/records/utils";

const store = configureStore({
  items: mapRawItems(window.__initialItems__)
});

export default () => {
  return <Provider store={store}>
    <div className={style.fillContainer}>
      <div id={APP_HTML_ID} className={style.fillContainer}>
        <Canvas />
        <Toolbar />
        <MousePosition />
      </div>

      <div>
        <DevTools />
      </div>
    </div>
  </Provider>;
};
