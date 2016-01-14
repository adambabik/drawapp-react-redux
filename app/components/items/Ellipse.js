import style from "./items.scss";
import React from "react";
import classNames from "classnames";
import Shape from "./Shape";

import debug from "debug";
const log = debug("app:ellipse");

export default class Ellipse extends Shape {
  render() {
    // log("render");

    const item = this.immState.get("item");
    const { cx, cy, rx, ry } = item;
    const className = classNames({
      [style.ellipse]: true,
      [style.selected]: item.selected
    });

    return <g>
      <ellipse
        className={className}
        cx={cx} cy={cy}
        rx={rx} ry={ry}></ellipse>
      {this.renderAnchors()}
    </g>;
  }
}
