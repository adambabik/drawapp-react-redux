import { Record } from "immutable";

const NotImplemented = () => new Error("Not implemented");

export const shapeDefaults = {
  id        : "",
  name      : "shape",
  selected  : false,
  persistent: true
};

export const shapeInterface = {
  get center() {
    throw NotImplemented();
  },

  get position() {
    throw NotImplemented();
  },

  rectWrapper() {
    throw NotImplemented();
  },

  containsPoint(/* x, y */) {
    throw NotImplemented();
  },

  updatePosition(/* x, y */) {
    throw NotImplemented();
  },

  updateSize(/* width, height */) {
    throw NotImplemented();
  },

  isInRect(/* rect */) {
    throw NotImplemented();
  }
};

export function createShapeRecord(defaults) {
  let RecordClass = Record(Object.assign({}, shapeDefaults, defaults));

  // extend RecordClass.prototype with interface properties
  Object
    .getOwnPropertyNames(shapeInterface)
    .forEach(name => {
      let descriptor = Object.getOwnPropertyDescriptor(shapeInterface, name);
      Object.defineProperty(RecordClass.prototype, name, descriptor);
    });

  return RecordClass;
}
