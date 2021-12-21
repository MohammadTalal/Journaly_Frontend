import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-form-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import moment from "moment";

import "./NewPost.css";

const NewPost = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();

  //Here we are going to set user name
  const [username, SetUserName] = useState("");
  const [userimage, SetUserImage] = useState("");

  useEffect(() => {
    async function fetchName() {
      try {
        const res = await sendRequest(
          `/api/users/${auth.userId}`
        );
        SetUserName(res.username[0].name);
        SetUserImage(res.username[0].imageUrl);
      } catch (error) {}
    }
    fetchName();
  }, [sendRequest, auth.userId]);
  const initialValues = {
    title: "",
    content: "",
    image: "",
    username: username,
    userimage: userimage,
  };

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("userId", auth.userId);
      formData.append("username", values.username);
      formData.append("image", values.image);
      formData.append("userimage", values.userimage);

      formData.append("filterDate", moment(new Date()).format("YYYY-MM-DD"));
      await sendRequest("/api/posts", "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
      // Redirect the user to next page
      history.push("/");
    } catch (error) {}
  };

  let validationSchema = Yup.object({
    title: Yup.string().required("Journal Title Cannot Be Empty!"),
    content: Yup.string().required("Journal Content Cannot Be Empty!"),
    // image: Yup.string().required("Image Cannot Be Empty!"),
  });

  // Set the formik for form validation
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  });

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="journal-form" onSubmit={formik.handleSubmit}>
        {isLoading && <LoadingSpinner asOverlay />}
        <label htmlFor="title">Title:</label>
        <input
          className="form-control"
          type="text"
          id="title"
          name="title"
          {...formik.getFieldProps("title")}
        />
        <div className="error">
          {formik.touched.title && formik.errors.title ? (
            <div>{formik.errors.title}</div>
          ) : null}
        </div>

        <label htmlFor="content">Journal Content:</label>
        <textarea
          className="form-control"
          id="content"
          rows="10"
          name="content"
          placeholder="Type daily journal here..."
          {...formik.getFieldProps("content")}
        />
        <div className="error">
          {formik.touched.content && formik.errors.content ? (
            <div>{formik.errors.content}</div>
          ) : null}
        </div>

        <input
          type="file"
          name="image"
          accept=".jpg,.png,.jpeg"
          onChange={(event) =>
            formik.setFieldValue("image", event.target.files[0])
          }
        />

        <button
          className="form-btn"
          type="submit"
          disabled={!(formik.dirty && formik.isValid)}
        >
          Add Journal
        </button>
      </form>
    </React.Fragment>
  );
};

export default NewPost;
