import { List } from "immutable";
import { compose } from "redux";
import { rectFactory } from "./rect";
import { ellipseFactory } from "./ellipse";

const applyWrapper = (fn, cond) => (wrapper) => (item) => {
  return wrapper(cond(item) ? fn(item) : item);
};

export const mapRawItem = compose(
  applyWrapper(rectFactory, item => item.name === "rect"),
  applyWrapper(ellipseFactory, item => item.name === "ellipse")
)(item => item);

export function mapRawItems(items = []) {
  return new List(items.map(mapRawItem));
}
