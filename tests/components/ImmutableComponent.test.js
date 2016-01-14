/* eslint-env mocha */

import { expect } from "chai";
import { spy } from "sinon";
import React from "react";
import { renderIntoDocument } from "react-addons-test-utils";

import ImmutableComponent from "../../app/components/ImmutableComponent";

class T extends ImmutableComponent {
  render() {
    return <span></span>;
  }
};

describe.skip("ImmutableComponent", function () {
  describe("get/set immState", function () {
    it("should be defined", function () {
      let desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(T.prototype), 'immState');
      expect(desc.get).to.be.a('function');
      expect(desc.set).to.be.a('function');
    });

    it("setter should update state", function () {
      let c = renderIntoDocument(<T/>);
      c.immState = { a: 1 };
      expect(c.immState.a).to.be.equal(1);
      expect(c.state.data.a).to.be.equal(1);
    });
  });

  describe("setImmState()", function () {
    beforeEach(function () {
      this.c = renderIntoDocument(<T/>);
    })

    it("should be defined", function () {
      expect(this.c.setImmState).to.be.a('function');
    });

    it("should call setState() method and update state", function () {
      let originalSetState = this.c.setState;

      // setState() spy
      this.c.setState = spy((...args) => originalSetState.apply(this.c, args));

      this.c.setImmState(state => ({ a: 1 }));  // value does not have to be immutable
      expect(this.c.setState.calledOnce).to.be.true;
      expect(this.c.state.data.a).to.equal(1);
    });
  });
});
