import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

// add missing SVG attributes
import DOMProperty from "react/lib/DOMProperty";
import ReactInjection from "react/lib/ReactInjection";

const MUST_USE_ATTRIBUTE = DOMProperty.injection.MUST_USE_ATTRIBUTE;
const SVGDOMMissingPropertyConfig = {
  Properties: {
    patternTransform: MUST_USE_ATTRIBUTE
  },
  DOMAttributeNames: {
    patternTransform: "patternTransform"
  }
};

ReactInjection.DOMProperty.injectDOMPropertyConfig(SVGDOMMissingPropertyConfig);

import debug from "debug";
debug.enable("app:*");
window.drawDebug = debug;

ReactDOM.render(<App />, document.querySelector("#root"));
