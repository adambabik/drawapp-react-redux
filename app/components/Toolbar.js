import style from "./toolbar.scss";
import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Modes } from "../constants";
import { changeMode, saveState } from "../actions";
import ToolbarItem from "./ToolbarItem";

import debug from "debug";
const log = debug("app:toolbar");

const values = (object) => Object.keys(object).map(k => object[k]);

class Toolbar extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(values(Modes)).isRequired,
    changeMode: PropTypes.func.isRequired
  };

  static Items = [
    { mode: Modes.MANAGE_MODE, title: "Manage" },
    { mode: Modes.DRAW_RECT_MODE, title: "Rect" },
    { mode: Modes.DRAW_ELLIPSE_MODE, title: "Ellipse" }
  ];

  render() {
    log("render");

    const changeModeAction = this.props.changeMode;
    const saveStateAction = this.props.saveState;
    const { mode, items } = this.props;

    return <div className={style.toolbar}>
      {this.constructor.Items.map((item, idx) => (
        <ToolbarItem
          key={idx}
          item={item}
          selected={mode === item.mode}
          onSelect={(item) => changeModeAction(item.mode)} />
      ))}
      <ToolbarItem
        key="sync-state"
        item={{ title: "Sync" }}
        onSelect={() => saveStateAction(items)} />
    </div>;
  }
}

export default connect(
  // map state to props
  state => ({
    mode: state.mode,
    items: state.items
  }),
  // map actions to props
  dispatch => bindActionCreators({
    changeMode,
    saveState
  }, dispatch)
)(Toolbar);
