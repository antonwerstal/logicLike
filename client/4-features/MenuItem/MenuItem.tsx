import React from "react";
import { NavLink } from "react-router-dom";
import "./MenuItem.scss";

type MenuItemInterface = {
  path: string;
  label: string;
};

export const MenuItem = (props: MenuItemInterface) => {
  const { path, label } = props;
  return (
    <NavLink className="MenuItem" to={path}>
      {label}
    </NavLink>
  );
};
