import React from "react";
import "./SuccessMessage.scss";
type SuccessMessageProps = { text: string };

export const SuccessMessage = (props: SuccessMessageProps) => {
  return <div className="SuccessMessage">{props.text}</div>;
};
