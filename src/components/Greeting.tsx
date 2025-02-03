import React from "react";

export function Greeting() {
  return (
    <div className="greeting-container">
      <span className="greeting-text">Hello, </span>
      <span className="greeting-text greeting-text-user">user</span>
      <span className="greeting-text">.</span>
    </div>
  );
}