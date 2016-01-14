import style from "./toolbar.scss";
import React from "react";
import classNames from "classnames";

export default ({ selected, item, onSelect }) => {
  const className = classNames({
    [style.toolbarItem]: true,
    [style.active]: selected
  });

  return <a href=""
    className={className}
    onClick={(ev) => {
      ev.preventDefault();
      onSelect(item);
    }}>{item.title}</a>;
};
