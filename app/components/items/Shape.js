import React, { PropTypes } from "react";
import { Map } from "immutable";
import ImmutableComponent from "../ImmutableComponent";
import ShapeAnchor, { AnchorType } from "./ShapeAnchor";

import debug from "debug";
const log = debug("app:shape");

export default class Item extends ImmutableComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onEdit: PropTypes.func
  };

  constructor(props) {
    log("constructor", props);

    super(props);
    this.immState = new Map({ item: props.item });
  }

  componentWillReceiveProps(newProps) {
    this.updateStateWithItem(newProps.item);
  }

  // want to have control over updating an item, doing it via dispatch()
  // would cause difficulties in debugging
  updateStateWithItem(item) {
    // log("updateWithItem", String(item));

    this.setImmState(state => state.set("item", item));
  }

  handleAnchor(anchorType) {
    log("handleAnchor", anchorType);

    if (!this.props.onEdit) return;

    const item = this.immState.get("item");
    const { x, y, width, height } = item.rectWrapper();
    // could adjusted with actual event x and y
    const mouseDownPosition = { x, y };

    if (anchorType === AnchorType.BOTTOM_LEFT || anchorType === AnchorType.TOP_LEFT) {
      mouseDownPosition.x += width;
    }
    if (anchorType === AnchorType.TOP_RIGHT || anchorType === AnchorType.TOP_LEFT) {
      mouseDownPosition.y += height;
    }

    this.props.onEdit(item.id, mouseDownPosition);
  }

  renderAnchors() {
    const item = this.immState.get("item");
    const { x, y, width, height } = item.rectWrapper();

    if (!item.get("selected") || (width === 0 && height === 0)) return null;

    return <g>
      <ShapeAnchor x={x} y={y}
        onMouseDown={() => this.handleAnchor(AnchorType.TOP_LEFT)}>
      </ShapeAnchor>
      <ShapeAnchor x={x + width} y={y}
        onMouseDown={() => this.handleAnchor(AnchorType.TOP_RIGHT)}>
      </ShapeAnchor>
      <ShapeAnchor x={x} y={y + height}
        onMouseDown={() => this.handleAnchor(AnchorType.BOTTOM_LEFT)}>
      </ShapeAnchor>
      <ShapeAnchor x={x + width} y={y + height}
        onMouseDown={() => this.handleAnchor(AnchorType.BOTTOM_RIGHT)}>
      </ShapeAnchor>
    </g>;
  }

  render() {
    throw new Error("Not implemented");
  }
}
