import style from "./canvas.scss";
import React from "react";
import classNames from "classnames";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fromJS } from "immutable";
import { MANAGE_MODE, DRAW_RECT_MODE, DRAW_ELLIPSE_MODE, APP_HTML_ID } from "../constants";
import * as actions from "../actions";
import { createTransformStream } from "../streams/transform";
import { MoveDelegate } from "../delegates/moveDelegate";
import { DrawDelegate } from "../delegates/drawDelegate";
import ImmutableComponent from "./ImmutableComponent";
import { rectFactory, RECT_SHAPE, RECT_SELECT } from "./items/records/rect";
import Rect from "./items/Rect";
import { ellipseFactory } from "./items/records/ellipse";
import Ellipse from "./items/Ellipse";

import debug from "debug";
const log = debug("app:canvas");

const isDrawMode = mode => ([DRAW_RECT_MODE, DRAW_ELLIPSE_MODE].indexOf(mode) > -1);

class Canvas extends ImmutableComponent {
  constructor(props) {
    log("constructor", props);

    super(props);
    this.handler = null;
    this.mouseDown = false;
    this.immState = fromJS({
      transform: { x: 0, y: 0 }
    });
  }

  get transform() {
    return this.immState.get("transform");
  }

  componentDidMount() {
    this.transformStream = createTransformStream(document.querySelector(`#${APP_HTML_ID}`))
      .subscribe(transform => {
        this.setImmState(state => state.mergeIn(["transform"], transform));
      });
  }

  componentWillUnmount() {
    if (this.transformStream) {
      this.transformStream.dispose();
    }
  }

  toLocalCoordinates(ev) {
    const transform = this.immState.get("transform");

    return {
      x: ev.clientX - transform.get("x"),
      y: ev.clientY - transform.get("y")
    };
  }

  findItemAtPoint(point) {
    return this.props.items
      .reverse()
      .find(item => item.persistent && item.containsPoint(point));
  }

  generateNewItem(mode, config) {
    log("generateNewItem", mode);

    switch (mode) {
      case DRAW_RECT_MODE:
        return rectFactory(Object.assign(
          { type: RECT_SHAPE },
          config
        ));
      case DRAW_ELLIPSE_MODE:
        return ellipseFactory(config);
      case MANAGE_MODE:
        return rectFactory(Object.assign(
          { type: RECT_SELECT, persistent: false },
          config
        ));
      default:
        return null;
    }
  }

  deselectItems(items) {
    log("deselectItems", String(items));

    return items
      .map(item => item.set("selected", false))
      .forEach(this.props.changeItem);
  }

  removeItems(items) {
    log("removeItems", String(items));

    items.forEach(this.props.removeItem);
  }

  editItem(itemId, mouseDownPosition) {
    log("editItem", itemId, mouseDownPosition);

    const transform = this.immState.get("transform");
    const item = this.props.items.find(anItem => anItem.id === itemId);

    if (!item) throw new Error("Can't edit " + itemId);

    this.handler = new DrawDelegate(this, item);
    this.handler.mouseDownPosition = {
      x: mouseDownPosition.x + transform.get("x"),
      y: mouseDownPosition.y + transform.get("y")
    };
    this.mouseDown = true;
  }

  handleMouseDown(ev) {
    log("handleMouseDown");

    if (this.handler) return;

    this.mouseDown = true;

    const { changeItem, mode, selectedItems } = this.props;

    if (mode === MANAGE_MODE) {
      // find a clicked item
      const selectedItem = this.findItemAtPoint(this.toLocalCoordinates(ev));

      // clicked on an item from a selectrd group of items
      if (selectedItems.size > 1 && selectedItem && selectedItem.selected) {
        this.handler = new MoveDelegate(selectedItems, selectedItems);
      } else if (selectedItem) {
        // clicked on a single item
        this.deselectItems(selectedItems.filter(item => item !== selectedItem));

        let changedSelectedItem = selectedItem.set("selected", true);
        changeItem(changedSelectedItem);
        this.handler = new MoveDelegate(changedSelectedItem, selectedItem);
      } else {
        this.deselectItems(selectedItems);
      }
    } else {
      // click on free space,
      // drawing new items is delayed to avoid creating not visible items,
      // check `handleMouseMove()`
      this.deselectItems(selectedItems);
    }

    if (this.handler) {
      this.handler.handleMouseDown(ev);
    }
  }

  handleMouseMove(ev) {
    // log("handleMouseMove", this.mouseDown, this.handler);

    if (!this.mouseDown) return;

    const { addItem, mode } = this.props;

    if (!this.handler) {
      const item = this.generateNewItem(mode, { selected: isDrawMode(mode) });
      addItem(item);
      this.handler = new DrawDelegate(this, item);
      this.handler.handleMouseDown(ev);
    } else {
      this.handler.handleMouseMove(ev);
      // update React elements directly, without changing the app state
      // in order to reduce number of actions and performance
      this.handler.items.forEach(item => {
        let ref = this.refs[item.id];
        if (ref) {
          ref.updateStateWithItem(item);
        }
      });
    }
  }

  handleMouseUp(ev) {
    log("handleMouseUp");

    this.mouseDown = false;

    if (!this.handler) return;

    const { changeItem, removeItem, mode, items } = this.props;

    this.handler.handleMouseUp(ev);
    let handlerItems = this.handler.items;

    if (mode === MANAGE_MODE && handlerItems.first().type === RECT_SELECT) {
      handlerItems = items
        .filter(item => item.persistent && item.isInRect(this.handler.item))
        .map(item => item.set("selected", true));
    }

    // dispatch info about changed items
    handlerItems.forEach(changeItem);

    // remove not persistent items
    items
      .filter(item => !item.persistent)
      .forEach(removeItem);

    this.handler = null;
  }

  handleDoubleClick(ev) {
    log("handleDoubleClick");

    if (this.props.mode !== MANAGE_MODE) return;

    const selectedItem = this.findItemAtPoint(this.toLocalCoordinates(ev));
    if (selectedItem) {
      this.props.removeItem(selectedItem);
    }
  }

  renderGridDefs(transform) {
    const translate = `translate(${transform.get("x")}, ${transform.get("y")})`;

    return <defs>
      <pattern id='small-grid' width='10' height='10' patternUnits='userSpaceOnUse'>
        <path d='M 10 0 L 0 0 0 10' className={classNames(style.canvasGrid, style.canvasGridSmall)}></path>
      </pattern>
      <pattern id='grid' width='100' height='100' patternUnits='userSpaceOnUse' patternTransform={translate}>
        <rect width='100' height='100' fill='url(#small-grid)'></rect>
        <path d='M 100 0 L 0 0 0 100' className={classNames(style.canvasGrid, style.canvasGridLarge)}></path>
      </pattern>
    </defs>;
  }

  renderItem(item) {
    log("renderItem", item);

    if (!this.boundEditItem) {
      this.boundEditItem = this.editItem.bind(this);
    }

    switch (item.name) {
      case "rect":
        return <Rect key={item.id} ref={item.id} item={item} onEdit={this.boundEditItem} />;
      case "ellipse":
        return <Ellipse key={item.id} ref={item.id} item={item} onEdit={this.boundEditItem} />;
      default:
        return null;
    }
  }

  render() {
    log("render", this.immState.toString());

    const transform = this.immState.get("transform");
    const translate = `translate(${transform.get("x")}, ${transform.get("y")})`;
    const { items } = this.props;

    return (
      <div className={style.canvas}
           onMouseDown={::this.handleMouseDown}
           onMouseMove={::this.handleMouseMove}
           onMouseUp={::this.handleMouseUp}
           onDoubleClick={::this.handleDoubleClick}>
        <svg className={style.canvasFrame}>
          {this.renderGridDefs(transform)}

          <rect width='100%' height='100%' fill='url(#grid)'></rect>

          <g transform={translate}>
            {items.map(item => this.renderItem(item))}
          </g>
        </svg>
      </div>
    );
  }
}

export default connect(
  // map state to props
  state => ({
    items: state.items,
    selectedItems: state.items.filter(item => item.selected),
    mode: state.mode
  }),
  // map actions to props
  dispatch => bindActionCreators(actions, dispatch)
)(Canvas);
