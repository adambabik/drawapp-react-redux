import Rx from "rx-lite";

const velocityMul = 0.1;
const windowDuration = 1000 / 60;

export function createScrollStream(element) {
  let pos = { x: 0, y: 0 };

  return Rx.Observable
    .fromEvent(
      element,
      "wheel",
      ev => {
        ev.preventDefault();

        pos.x = ev.wheelDeltaX * velocityMul;
        pos.y = ev.wheelDeltaY * velocityMul;

        return pos;
      }
    )
    .throttle(windowDuration);
}
