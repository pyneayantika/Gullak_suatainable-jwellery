import React from "react";
export default function Overline({ children, className = "" }) {
  return <div className={`overline ${className}`}>{children}</div>;
}
