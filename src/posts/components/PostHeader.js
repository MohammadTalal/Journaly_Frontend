import React from "react";
import UserImage from "../../shared/components/UIElements/UserImage";

import "./PostHeader.css";

// The post header includes user image, and user name.
const PostHeader = ({ username, userImage }) => {
  const userInfo = {
    id: "u1",
    name: username,
    image: userImage,
    places: 3,
  };

  return (
    <div className="user-item__content">
      <div className="user-item__image">
        <UserImage image={userInfo.image} alt={userInfo.name} />
      </div>
      <div className="user-item__info">
        <h2>{userInfo.name}</h2>
      </div>
    </div>
  );
};

export default PostHeader;
