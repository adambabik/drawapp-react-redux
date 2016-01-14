import uuid from "node-uuid";
import { createShapeRecord } from "./shape";

const sq = i => i * i;

const defaults = {
  name : "ellipse",
  cx   : 0,
  cy   : 0,
  rx   : 0,
  ry   : 0
};

export class EllipseRecord extends createShapeRecord(defaults) {
  get center() {
    return { x: this.cx, y: this.cy };
  }

  get position() {
    return { x: this.cx, y: this.cy };
  }

  rectWrapper() {
    const pos = this.position;
    pos.x -= this.rx;
    pos.y -= this.ry;
    pos.width = this.rx * 2;
    pos.height = this.ry * 2;
    return pos;
  }

  containsPoint({ x, y }) {
    return sq(this.cx - x) / sq(this.rx) + sq(this.cy - y) / sq(this.ry) <= 1;
  }

  updatePosition(x, y) {
    return this.withMutations(m => {
      return m.set("cx", x).set("cy", y);
    });
  }

  updateSize(width, height) {
    return this.withMutations(m => {
      return m
        .set("cx", m.cx + width / 2).set("cy", m.cy + height / 2)
        .set("rx", width / 2).set("ry", height / 2);
    });
  }

  // TODO: it's buggy if rect is in more than one quadrant
  isInRect(rect) {
    const { x: sx1, y: sy1 } = rect;
    const sx2 = sx1 + rect.width;
    const sy2 = sy1 + rect.height;
    const rcx = sx1 + rect.width / 2;
    const rcy = sy1 + rect.height / 2;

    const { x, y } = this.position;

    // center of the rect is in the ellipse
    if (sq(x - rcx) / sq(this.rx) + sq(y - rcy) / sq(this.ry) <= 1) return true;

    if (x <= rcx && y >= rcy) {  // the first quadrant
      return sq(x - sx1) / sq(this.rx) + sq(y - sy1 - rect.height) / sq(this.ry) <= 1;
    }

    if (x >= rcx && y >= rcy) {  // the second quadrant
      return sq(x - sx2) / sq(this.rx) + sq(y - sy2) / sq(this.ry) <= 1;
    }

    if (x >= rcx && y < rcy) {  // the third quadrant
      return sq(x - sx1 - rect.width) / sq(this.rx) + sq(y - sy1) / sq(this.ry) <= 1;
    }

    if (x < rcx && y < rcy) {  // the forth quadrant
      return sq(x - sx1) / sq(this.rx) + sq(y - sy1) / sq(this.ry) <= 1;
    }

    return false;
  }
}

export function ellipseFactory(...objects) {
  const config = Object.assign(
    { id: `ellipse-${uuid.v4()}` },
    ...objects
  );
  return new EllipseRecord(config);
}
