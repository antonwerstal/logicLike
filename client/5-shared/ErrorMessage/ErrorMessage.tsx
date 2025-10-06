import React from "react";
import "./ErrorMessage.scss";

type ErrorMessageProps = {
  text: string;
};

export const ErrorMessage = (props: ErrorMessageProps) => {
  return <div className="ErrorMessage">{props.text}</div>;
};
