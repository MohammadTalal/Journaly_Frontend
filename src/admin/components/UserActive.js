import React, { useEffect, useState, useContext } from "react";
import "./UserActive.css";
import { AuthContext } from "../../shared/context/auth-form-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Modal from "../../shared/components/UIElements/Modal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import SingleStatus from "./SingleStatus";

const UserActive = () => {
  const [allusers, setAllUsers] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [singleuser, setUser] = useState({});
  const { sendRequest, isLoading } = useHttpClient();
  const auth = useContext(AuthContext);
  // when you click the chnage status btn then pop up shows with that user info which on you clicked
  const showStatusModal = async (userid) => {
    try {
      const res = await sendRequest(
        `/api/users/${userid}`
      );
      setUser(res.username[0]);
    } catch (error) {}
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  // this api fetch all users from database and set it to users letiable

  useEffect(() => {
    async function fetchAllusers() {
      try {
        const res = await sendRequest(`/api/users/`);
        setAllUsers(res.users);
      } catch (error) {}
    }
    fetchAllusers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <h2 style={{ textAlign: "center" }}>ACTIVE AND DEACTIVE TO USER</h2>

      <div style={{ overflow: "auto", height: "400px" }}>
        <table>
          <thead>
            <tr>
              <th scope="col">UserName</th>
              <th scope="col">UserType</th>
              <th scope="col">UserStatus</th>
              <th scope="col">UserStatus</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* use map function to show all users in table */}
            {allusers.map((user) => (
              <tr key={user.id}>
                <td data-label="Name">{user.name}</td>
                <td data-label="Role">{user.role}</td>
                <td data-label="Status">{user.status}</td>
                <td data-label="Email">{user.email}</td>

                <td data-label="Action">
                  <div
                    style={{
                      //   display: "flex",
                      //   justifyContent: "center",
                      //   alignItems: "center",
                      //   width: "100px",
                      marginLeft: "10px",
                    }}
                  >
                    <Modal
                      show={showConfirmModal}
                      onCancel={cancelDeleteHandler}
                      header="User Status"
                      footerClass="post-item__modal-actions"
                      footer={
                        <React.Fragment>
                          <button
                            className="form-btn"
                            style={{ marginTop: "0px" }}
                            onClick={cancelDeleteHandler}
                          >
                            CANCEL
                          </button>
                        </React.Fragment>
                      }
                    >
                      {/* <ErrorModal error={error} onClear={clearError} /> */}
                      {auth.isSignedIn ? (
                        <form>
                          {isLoading && <LoadingSpinner asOverlay />}
                          <label htmlFor="comment">Change User status:</label>
                          <SingleStatus user={singleuser} />
                        </form>
                      ) : null}
                    </Modal>
                    <button
                      className="status-btn"
                      onClick={() => showStatusModal(user.id)}
                    >
                      Change Status
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default UserActive;
