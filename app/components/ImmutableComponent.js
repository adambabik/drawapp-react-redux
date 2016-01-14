import { Component } from "react";
import { is } from "immutable";

// import debug from "debug";
// const log = debug("app:immutableComponent");

// source: https://github.com/jurassix/react-immutable-render-mixin/blob/master/shallowEqualImmutable.js
export function eqImmutable(objA, objB) {
  if (objA === objB || is(objA, objB)) {
    return true;
  }

  if (typeof objA !== "object" || objA === null ||
      typeof objB !== "object" || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

// could use Symbol, but React does not support it
const immutableStateKey = "__data__";

export default class ImmutableComponent extends Component {
  get immState() {
    return this.state ? this.state[immutableStateKey] : null;
  }

  set immState(data) {
    if (!this.state) {
      this.state = {};
    }

    this.state[immutableStateKey] = data;
  }

  setImmState(fn = null, callback) {
    if (typeof fn === "function") {
      return this.setState(state => ({
        [immutableStateKey]: fn(state ? state[immutableStateKey] : null)
      }), callback);
    } else if (fn) {
      return this.setState({
        [immutableStateKey]: fn
      }, callback);
    } else {
      return this.setState(fn, callback);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let resultProps = !eqImmutable(nextProps, this.props);
    let resultState = !eqImmutable(nextState, this.state);

    return resultProps || resultState;

  }
}
