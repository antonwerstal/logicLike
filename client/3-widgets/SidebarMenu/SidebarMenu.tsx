import React from "react";
import { MenuItem } from "@features/MenuItem";

enum SideBarMenuRoutes {
  HOME = "/home",
}

export const SidebarMenu = () => {
  return (
    <div className="SidebarMenu">
      <MenuItem path={SideBarMenuRoutes.HOME} label="Главная" />
    </div>
  );
};
