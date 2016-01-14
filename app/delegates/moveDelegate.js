import { List } from "immutable";

function convertToList(items) {
  if (List.isList(items)) {
    return items;
  } else if (Array.isArray(items)) {
    return new List(items);
  } else {
    return List.of(items);
  }
}

export class MoveDelegate {
  constructor(items, originalItems = null) {
    this.items = convertToList(items);
    this.originalItems = convertToList(originalItems || items);
    this.mouseDownPosition = null;
    this.moved = false;
  }

  handleMouseDown(ev) {
    this.mouseDownPosition = { x: ev.clientX, y: ev.clientY };
  }

  handleMouseUp() {}

  handleMouseMove(ev) {
    this.moved = true;

    let diffX = ev.clientX - this.mouseDownPosition.x;
    let diffY = ev.clientY - this.mouseDownPosition.y;

    this.items = this.items.map((item, idx) => {
      const { x, y } = this.originalItems.get(idx).position;
      return item.updatePosition(x + diffX, y + diffY);
    });
  }
}
