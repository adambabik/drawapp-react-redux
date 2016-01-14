import uuid from "node-uuid";
import { createShapeRecord } from "./shape";

export const RECT_SHAPE = "rect-shape";
export const RECT_SELECT = "rect-select";

const defaults = {
  name      : "rect",
  type      : RECT_SHAPE,
  x         : 0,
  y         : 0,
  width     : 0,
  height    : 0
};

export class RectRecord extends createShapeRecord(defaults) {
  get center() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
  }

  get position() {
    return this;
  }

  rectWrapper() {
    return this;
  }

  containsPoint({ x, y }) {
    const { x: ltx, y: lty } = this;
    const rdx = ltx + this.width;
    const rdy = lty + this.height;

    return x >= ltx && x <= rdx && y >= lty && y <= rdy;
  }

  updatePosition(x, y) {
    return this.withMutations(m => {
      return m.set("x", x).set("y", y);
    });
  }

  updateSize(width, height) {
    return this.withMutations(m => {
      return m.set("width", width).set("height", height);
    });
  }

  isInRect(rect) {
    const { x: sx1, y: sy1 } = this;
    const sx2 = sx1 + this.width;
    const sy2 = sy1 + this.height;

    const { x: x1, y: y1 } = rect;
    const x2 = x1 + rect.width;
    const y2 = y1 + rect.height;

    return sx1 <= x2 && sx2 >= x1 && sy1 <= y2 && sy2 >= y1;
  }
}

export function rectFactory(...objects) {
  const config = Object.assign({ id: `rect-${uuid.v4()}` }, ...objects);
  return new RectRecord(config);
}
