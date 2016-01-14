/* eslint-env mocha */

import { expect } from "chai";
import rect from "../../app/records/rect";

describe.only("Rect", function() {
  it("should create a Rect instance with default args", function() {
    let r = rect();
    expect(r.id).to.contain("rect-");
    expect(r.x).to.equal(0);
    expect(r.y).to.equal(0);
    expect(r.width).to.equal(0);
    expect(r.height).to.equal(0);
  });

  it("should create a Rect instance with several config objects", function() {
    let r = rect({ id: "test" }, { x: 10 });
    expect(r.id).to.equal("test");
    expect(r.x).to.equal(10);
    expect(r.width).to.equal(0);
    expect(r.height).to.equal(0);
  });

  it("should return a proper center", function() {
    let r = rect({ x: 10, y: 10, width: 100, height: 200 });
    expect(r.center).to.deep.equal({ x: 60, y: 110 });
  });

  it("should return a proper position", function() {
    let r = rect({ x: 10, y: 10, width: 100, height: 200 });
    expect(r.position).to.deep.equal({ x: 10, y: 10 });
  });

  describe("#containPosition()", function() {
    it("should contain a center point", function() {
      let r = rect({ x: 10, y: 10, width: 100, height: 200 });
      let { x, y } = r.center;
      expect(r.containsPoint(x, y)).to.equal(true);
    });

    it("should contain a boundary point", function() {
      let r = rect({ x: 10, y: 10, width: 100, height: 200 });
      expect(r.containsPoint(10, 10)).to.equal(true);
    });
  });

  it("should updatePosition() create a new instance", function() {
    let r = rect({ x: 10, y: 10, width: 100, height: 200 });
    let newR = r.updatePosition(20, 15);
    expect(newR.position).to.deep.equal({ x: 20, y: 15 });
  });

  it("should updateSize() create a new instance", function() {
    let r = rect({ x: 10, y: 10, width: 100, height: 200 });
    let newR = r.updateSize(300, 400);
    expect(newR.width).to.equal(300);
    expect(newR.height).to.equal(400);
  });

  describe("toComponent()", function() {
    it("should return Rect component instance", function() {
      let r = rect({ x: 10, y: 10, width: 100, height: 200 });
      let rComponent = r.toComponent();
      expect(rComponent.key).to.equal(r.id);
    });

    it("should add new properties to the Rect component", function() {
      let onEdit = () => {};
      let r = rect({ x: 10, y: 10, width: 100, height: 200 });
      let rComponent = r.toComponent({ onEdit });
      expect(rComponent.props.onEdit).to.equal(onEdit);
    });
  });
});
