import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-form-context";
import Modal from "../../shared/components/UIElements/Modal";
import { useHistory } from "react-router-dom";
import moment from "moment";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import axios from "axios";
import "./Profile.css";
const Profile = () => {
  const [user, setUser] = useState("");
  const [o_password, setOldPassword] = useState("");
  const [n_password, setNewPassword] = useState("");
  const [c_password, setConfirmPassword] = useState("");
  const [Error, setError] = useState("");
  const [ErrorPassword, setErrorPassword] = useState("");

  const [image, setImage] = useState(null);

  //   const [user, setImages] = useState("");

  const [showConfirmPasswordModal, setShowImageConfirmModal] = useState(false);
  const [showConfirmImageModal, setShowPasswordConfirmModal] = useState(false);

  const auth = useContext(AuthContext);
  const history = useHistory();

  const { sendRequest, isLoading } = useHttpClient();

  const changeUserImage = async () => {
    try {
      if (image === null) {
        return;
      }
      const formData = new FormData();
      formData.append("image", image);
      await axios
        .patch(`/api/users/image/${auth.userId}`, formData)
        .then((res) => console.log(res, "res"))
        .catch((err) => console.log(err));
      window.location.reload();
      history.push("/profile");
    } catch (error) {}
  };

  // this function is used to change password

  const ConfirmPassword = async () => {
    try {
      const respnseData = await sendRequest(
        `/api/users/verify/${auth.userId}`,
        "POST",
        JSON.stringify({
          old_password: o_password,
        }),
        { "Content-Type": "application/json" }
      );
      return respnseData.verifyPassword;
    } catch (error) {}
  };
  const changeUserPassword = async () => {
    try {
      const check = await ConfirmPassword();
      if (check) {
        setError("");
        if (n_password.length === 0) {
          setErrorPassword("All fields are required");
          return;
        }
        if (c_password.length === 0) {
          setErrorPassword("All fields are required");
          return;
        }
        if (n_password.length < 8) {
          setErrorPassword("Password must be contain minimum 8 characters");
          return;
        }
        if (n_password !== c_password) {
          setErrorPassword("Password did not match");
          return;
        }
        await sendRequest(
          `/api/users/password/${auth.userId}`,
          "POST",
          JSON.stringify({
            password: n_password,
          }),
          { "Content-Type": "application/json" }
        );
        window.location.reload();
        history.push("/profile");
      } else {
        setError("Old Password is Incorrect");
        setErrorPassword("");
      }
    } catch (error) {}
  };

  // this useEffect is used to fetch user by id
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await sendRequest(`/api/users/${auth.userId}`);
        setUser(res.username[0]);
      } catch (error) {}
    }

    fetchUser();
  }, [auth.userId, sendRequest]);

  const cancelDeleteHandler = () => {
    setShowPasswordConfirmModal(false);
    setShowImageConfirmModal(false);
  };

  const setShowPasswordModal = () => {
    setShowPasswordConfirmModal(true);
  };
  const setShowImageModal = () => {
    setShowImageConfirmModal(true);
  };

  const uploadImage = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <React.Fragment>
      <div className="journal-form">
        <Modal
          show={showConfirmImageModal}
          onCancel={cancelDeleteHandler}
          header="Change User Profile"
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
          {auth.isSignedIn ? (
            <div className="journal-form">
              {isLoading && <LoadingSpinner asOverlay />}
              <label htmlFor="image">User Image:</label>
              <input
                type="file"
                name="image"
                id="image"
                accept=".jpg,.png,.jpeg"
                onChange={(e) => uploadImage(e)}
              />
              <button className="form-btn" onClick={() => changeUserImage()}>
                Change Image
              </button>
            </div>
          ) : null}
        </Modal>
        <Modal
          show={showConfirmPasswordModal}
          onCancel={cancelDeleteHandler}
          header="Change User Profile"
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
          {auth.isSignedIn ? (
            <div className="journal-form">
              {isLoading && <LoadingSpinner asOverlay />}
              <label htmlFor="password">Old Password:</label>
              <input
                className="form-control"
                type="password"
                id="oldpassword"
                name="oldpassword"
                autoComplete="off"
                value={o_password}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <p style={{ color: "red", fontSize: "15px" }}>{Error}</p>
              <label htmlFor="password">New Password:</label>
              <input
                className="form-control"
                type="password"
                id="n_password"
                name="n_password"
                autoComplete="off"
                value={n_password}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label htmlFor="password">Confirm Password:</label>
              <input
                className="form-control"
                type="password"
                id="c_password"
                name="c_password"
                autoComplete="off"
                value={c_password}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <p style={{ color: "red", fontSize: "15px" }}>{ErrorPassword}</p>
              <button className="form-btn" onClick={() => changeUserPassword()}>
                Change Password
              </button>
            </div>
          ) : null}
        </Modal>
        <div className="pro-card">
          {user === undefined ? null : (
            <img className="pro-image" src={`${user.imageUrl}`} alt="profile" />
          )}

          <div className="profile-content">
            <table>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Register Date</th>
                  <th scope="col">Email</th>
                </tr>
              </thead>
              <tbody>
                <tr key={user.id}>
                  <td data-label="Name">{user.name}</td>
                  <td data-label="Role">
                    {moment(user.registerDate).format("YYYY-MM-DD")}
                  </td>

                  <td data-label="Email">{user.email}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="action-buttons">
            <button className="button-17" onClick={() => setShowImageModal()}>
              Change Password
            </button>
            <button
              className="button-17"
              onClick={() => setShowPasswordModal()}
            >
              Change Image
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Profile;
