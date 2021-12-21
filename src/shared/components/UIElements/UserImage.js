import React from "react";

import "./UserImage.css";

// This component is responsible on displaying a user image inside a circle with elegant style
const UserImage = (props) => {
  return (
    <div className={`profileImg ${props.className}`} style={props.style}>
      <img
        src={`${props.image}`}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      />
    </div>
  );
};

export default UserImage;
