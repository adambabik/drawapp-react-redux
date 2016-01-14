import { createScrollStream } from "./scroll";

export function createTransformStream(element, startTransform = { x: 0, y: 0 }) {
  let transform = startTransform;

  return createScrollStream(element)
    .map(delta => {
      transform.x += delta.x;
      transform.y += delta.y;

      return transform;
    })
    .startWith(transform);
}
