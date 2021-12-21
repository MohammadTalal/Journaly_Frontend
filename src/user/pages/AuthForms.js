import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import Card from "../../shared/components/UIElements/Card";
import * as Yup from "yup"; // for form validation
import { AuthContext } from "../../shared/context/auth-form-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Modal from "../../shared/components/UIElements/Modal";
import "./AuthForms.css";

const AuthForms = () => {
  const auth = useContext(AuthContext);
  // Authentication mode flag, either sign in or sign up.
  const [isSigninMode, setIsSigninMode] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };
  // Set the initaial values for the form inputs
  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const onSubmit = async (values) => {
    if (isSigninMode) {
      try {
        const respnseData = await sendRequest(
          `/api/users/signin`,
          "POST",
          JSON.stringify({
            email: values.email,
            password: values.password,
          }),
          { "Content-Type": "application/json" }
        );

        // Here we set the user role whic is comming from database it is only does when we sign in .
        // we check on the base of role then we decide which route is for admin and which role is for user.
        localStorage.setItem("role", respnseData.role);
        // Here we set the user status whic is comming from database it is only does when we sign in .
        // we check on the base of status we check the status of user.
        localStorage.setItem("status", respnseData.status);
        // check if status is equal to deactivate then this condition true
        if (localStorage.getItem("status") === "deactivate") {
          // when condtion is true the pop up is come and say the error "your account has been deactivated"
          setShowConfirmModal(true);
          // here we are removing the role because we want to clear the data when user deactivated
          localStorage.removeItem("role");
          localStorage.removeItem("status");
          return;
        } else {
          auth.signIn(respnseData.userId, respnseData.token);
        }
      } catch (error) {}
    } else {
      try {
        const respnseData = await sendRequest(
          `/api/users/signup`,
          "POST",
          JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
          { "Content-Type": "application/json" }
        );

        // we set role of the user in localstorage like role:'admin/user'
        localStorage.setItem("role", respnseData.role);
        auth.signIn(respnseData.userId, respnseData.token);
      } catch (error) {}
    }
  };

  // Form validation to check for the following:
  // Required name, Required email, Required Password
  // Valid email, and Valid password (at least 8 char)
  let validationSchema;
  if (!isSigninMode) {
    // if a user is in the signup mode, the name will be required
    validationSchema = Yup.object({
      name: Yup.string().required("Name Required!"),
      email: Yup.string()
        .email("Invalid Email Format!")
        .required("Email Required!"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password Required!"),
    });
  } else {
    // if a user is in the signin mode the name is not required
    validationSchema = Yup.object({
      name: Yup.string().notRequired(),
      email: Yup.string()
        .email("Invalid Email Format!")
        .required("Email Required!"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password Required!"),
    });
  }

  // Set the formik
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  // Handle the switch to sign in or switch to sign up button
  const switchAuthFormHandler = () => {
    // Clear all the inputs, errors and reset all the visited fields
    formik.resetForm();
    // Check for the Auth Mode
    if (isSigninMode) {
      setIsSigninMode(false);
    } else {
      setIsSigninMode(true);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="form-box">
        {isLoading && <LoadingSpinner asOverlay />}
        {/* this model shows when a user not active */}
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
          <h2 style={{ textAlign: "center" }}>
            Your Account has been Deactivated
          </h2>
        </Modal>
        ;<h2>{isSigninMode ? "Sign In" : "Sign Up"}</h2>
        <h3>{isSigninMode ? "Welcome Back" : "It's Quick and Easy"}</h3>
        <form autoComplete="off" onSubmit={formik.handleSubmit}>
          {!isSigninMode && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                className="form-control"
                type="text"
                id="name"
                name="name"
                {...formik.getFieldProps("name")}
              />
              <div className="error">
                {formik.touched.name && formik.errors.name ? (
                  <div>{formik.errors.name}</div>
                ) : null}
              </div>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              className="form-control"
              type="email"
              id="email"
              name="email"
              {...formik.getFieldProps("email")}
            />
            <div className="error">
              {formik.touched.email && formik.errors.email ? (
                <div>{formik.errors.email}</div>
              ) : null}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              className="form-control"
              type="password"
              id="password"
              name="password"
              {...formik.getFieldProps("password")}
            />
            <div className="error">
              {formik.touched.password && formik.errors.password ? (
                <div>{formik.errors.password}</div>
              ) : null}
            </div>
          </div>
          <button
            className="form-btn"
            type="submit"
            disabled={!(formik.dirty && formik.isValid)}
          >
            {isSigninMode ? "SIGN IN" : "SIGN UP"}
          </button>
        </form>
        <button className="switch-form" onClick={switchAuthFormHandler}>
          {isSigninMode ? "Create a New Account" : "Click Here To Sign In"}
        </button>
      </Card>
    </React.Fragment>
  );
};

export default AuthForms;
