import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

const Button = (props) => {
  if (props.to) {
    return (
      <Link to={props.to} className="btn">
        {props.children}
      </Link>
    );
  }
  return (
    <button className="btn" onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default Button;
