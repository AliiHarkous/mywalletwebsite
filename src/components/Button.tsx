import React, { CSSProperties, ReactNode } from "react";

type Props = {
  disabled?: boolean;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
  value?: ReactNode;
};
export const Button = (props: Props) => {
  const className = props?.className != null ? props.className : "";
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      style={{ ...props.style }}
      className={className}
    >
      {props.value}
    </button>
  );
};
