import { List } from "immutable";

export class DrawDelegate {
  constructor(component, item) {
    this.component = component;
    this.item = item;
    this.mouseDownPosition = null;
  }

  get items() {
    return List.of(this.item);
  }

  handleMouseDown(ev) {
    this.mouseDownPosition = { x: ev.clientX, y: ev.clientY };
  }

  handleMouseUp() {}

  handleMouseMove(ev) {
    let tx = this.component.transform.get("x");
    let ty = this.component.transform.get("y");
    let { x: sx, y: sy } = this.mouseDownPosition;
    let diffX = ev.clientX - sx;
    let diffY = ev.clientY - sy;

    this.item = this.item
      .updatePosition(
        diffX < 0 ? (ev.clientX - tx) : (sx - tx),
        diffY < 0 ? (ev.clientY - ty) : (sy - ty)
      )
      .updateSize(Math.abs(diffX), Math.abs(diffY));
  }
}
