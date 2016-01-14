import style from "./items.scss";
import React from "react";
import classNames from "classnames";
import Shape from "./Shape";
import { RECT_SELECT } from "./records/rect";

import debug from "debug";
const log = debug("app:rect");

export default class Rect extends Shape {
  render() {
    // log("render", this.immState.get("item").toString());

    const { x, y, width, height, type, selected } = this.immState.get("item");
    const className = classNames({
      [style.rect]: true,
      [style.rectSelect]: type === RECT_SELECT,
      [style.selected]: selected
    });

    return <g>
      <rect ref="rect"
        className={className}
        width={width}
        height={height}
        x={x}
        y={y}>
      </rect>
      {this.renderAnchors()}
    </g>;
  }
}
