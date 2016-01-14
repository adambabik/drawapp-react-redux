import Rx from "rx-lite";

export function createMouseMoveStream(element) {
  let pos = { x: 0, y: 0 };

  return Rx.Observable.fromEvent(
    element,
    "mousemove",
    ev => {
      pos.x = ev.clientX;
      pos.y = ev.clientY;

      return pos;
    }
  );
}
