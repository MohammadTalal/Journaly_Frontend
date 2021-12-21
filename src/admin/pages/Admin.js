import React, { useState } from "react";
import "./Admin.css";
import UsersCountChart from "../components/UsersCountChart";
import PostsCountChart from "../components/PostsCountChart";
import UserActive from "../components/UserActive";

const Admin = () => {
  // when the toogle value is true this display the page of user status otherwise it shows the graph page
  // by default you see user status page
  // page and name of page both change when you will click
  const [toggle, setToggle] = useState(true);
  return (
    <React.Fragment>
      <div className="journal-form">
        {!toggle ? (
          <button
            className="active-btn"
            style={{ marginBottom: "10px" }}
            onClick={() => setToggle(true)}
          >
            Check the Status
          </button>
        ) : (
          <button
            className="deactive-btn"
            style={{ marginBottom: "10px" }}
            onClick={() => setToggle(false)}
          >
            Check the Graph
          </button>
        )}

        {!toggle && (
          <>
            <UsersCountChart />
            <PostsCountChart />
          </>
        )}
        {toggle && <UserActive />}
      </div>
    </React.Fragment>
  );
};

export default Admin;
