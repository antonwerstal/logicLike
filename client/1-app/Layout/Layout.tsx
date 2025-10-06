import React from "react";
import { SidebarMenu } from "@widgets/SidebarMenu";
import "./Layout.scss";

export const Layout = (props: React.PropsWithChildren) => {
  return (
    <div className="Layout">
      <div className="Layout-Left">
        <SidebarMenu />
      </div>
      <div className="Layout-Right">
        <div className="Layout-Right-Content">{props.children}</div>
      </div>
    </div>
  );
};
