import style from "./mouse-position.scss";
import React from "react";
import Rx from "rx-lite";
import { Map, fromJS } from "immutable";
import ImmutableComponent from "./ImmutableComponent";
import { APP_HTML_ID } from "../constants";
import { createTransformStream } from "../streams/transform";
import { createMouseMoveStream } from "../streams/mouse-move";

export default class MousePosition extends ImmutableComponent {
  constructor(props) {
    super(props);
    this.immState = fromJS({
      transform: { x: 0, y: 0 }
    });
  }

  componentDidMount() {
    const appEl = document.querySelector(`#${APP_HTML_ID}`);

    if (!appEl) return;

    const transformStream = createTransformStream(appEl);
    const mouseMoveStream = createMouseMoveStream(appEl);

    const mousePosition = { x: 0, y: 0 };

    this.mousePositionSource = Rx.Observable
      .combineLatest(
        transformStream,
        mouseMoveStream,
        (transform, position) => {
          mousePosition.x = position.x - transform.x;
          mousePosition.y = position.y - transform.y;

          return mousePosition;
        }
      )
      .subscribe(position => {
        this.setImmState(state => state.set("transform", new Map(position)));
      });
  }

  componentWillUnmount() {
    if (this.mousePositionSource) {
      this.mousePositionSource.dispose();
    }
  }

  render() {
    const transform = this.immState.get("transform");
    const x = (transform.get("x") + 0.5) | 0;
    const y = (transform.get("y") + 0.5) | 0;
    const val = `{ x: ${x}, y: ${y} }`;

    return <div className={style.mousePosition}>{val}</div>;
  }
}
