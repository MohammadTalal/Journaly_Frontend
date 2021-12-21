import React, { useContext } from "react";
import "./SingleStatus.css";
import { AuthContext } from "../../shared/context/auth-form-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
const SingleStatus = ({ user }) => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  // when user click active btn then this function call and replace the user status with 'active'
  const ActiveHandle = async (userid) => {
    try {
      await sendRequest(
        `/api/users/${userid}`,
        "PATCH",
        JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password,
          image: "",
          registerDate: user.registerDate,
          role: user.role,
          status: "active",
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      localStorage.setItem("status", "active");

      window.location.href("/admin");
    } catch (error) {}
  };

  // when user click deactivate btn then this function call and replace the user status with 'deactivate'

  const DeActiveHandle = async (userid) => {
    try {
      await sendRequest(
        `/api/users/${userid}`,
        "PATCH",
        JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password,
          image: "",
          registerDate: user.registerDate,
          role: user.role,
          status: "deactivated",
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      localStorage.setItem("status", "deactivate");
      window.location.href("/admin");
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <h4>
        Right now the status is:
        <p style={{ border: "1px solid gray", padding: "5px", margin: "5px" }}>
          {user.status}
        </p>
      </h4>
      <button className="active-btn" onClick={() => ActiveHandle(user.id)}>
        Active
      </button>
      <button className="deactive-btn" onClick={() => DeActiveHandle(user.id)}>
        DEACTIVE
      </button>
    </React.Fragment>
  );
};

export default SingleStatus;
