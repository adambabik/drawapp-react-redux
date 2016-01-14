import style from "./shape-anchor.scss";
import React, { PropTypes } from "react";
import classNames from "classnames";
import { Map } from "immutable";
import ImmutableComponent from "../ImmutableComponent";

import debug from "debug";
const log = debug("app:shapeAnchor");

export const AnchorSize = 12;
export const AnchorType = {
  TOP_LEFT: "TOP_LEFT",
  TOP_RIGHT: "TOP_RIGHT",
  BOTTOM_LEFT: "BOTTOM_LEFT",
  BOTTOM_RIGHT: "BOTTOM_RIGHT"
};

export default class ShapeAnchor extends ImmutableComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    onMouseDown: PropTypes.func
  };

  static mapFromProps(props) {
    return new Map({
      x: props.x - AnchorSize / 2,
      y: props.y - AnchorSize / 2,
      width: AnchorSize,
      height: AnchorSize
    });
  }

  constructor(props) {
    super(props);
    this.immState = this.constructor.mapFromProps(props);
  }

  componentWillReceiveProps(newProps) {
    this.setImmState(() => this.constructor.mapFromProps(newProps));
  }

  handleMouseDown(ev) {
    log("handleMouseDown");

    if (!this.props.onMouseDown) return;

    ev.stopPropagation();
    this.props.onMouseDown(ev);
  }

  render() {
    const { x, y, width, height } = this.immState.toJS();
    const className = classNames({
      [style.shapeAnchor]: true
    });

    return <rect className={className}
      x={x}
      y={y}
      width={width}
      height={height}
      onMouseDown={::this.handleMouseDown}>
    </rect>;
  }
}
