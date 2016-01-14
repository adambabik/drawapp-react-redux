/* eslint-env mocha */

import { jsdom } from "jsdom";
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = {userAgent: 'node.js'};

import { expect } from "chai";
import { spy } from "sinon";
import React from "react";
import { renderIntoDocument, findRenderedDOMComponentWithTag, Simulate } from "react-addons-test-utils";
import Rect from "../../app/components/rect";

describe.skip("Rect component", function () {
  it("should render", function () {
    let r = renderIntoDocument(
      <Rect x={10} y={10} width={50} height={50} />
    );
    expect(r).to.be.defined;
    expect(findRenderedDOMComponentWithTag(r, 'rect')).to.be.fined;
  });

  it("should call onSelect callback", function () {
    let selectHandler = spy();
    let r = renderIntoDocument(
      <Rect x={10} y={10} width={50} height={50} onSelect={selectHandler} />
    );

    Simulate.click(r.refs.rect);
    expect(selectHandler.calledOnce).to.be.true;
    expect(selectHandler.calledWith(r)).to.be.true;
  });
});
