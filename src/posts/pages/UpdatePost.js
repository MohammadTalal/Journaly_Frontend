import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-form-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/UIElements/Card";

// This page will be loaded when the edit button is pressed.
// It will have a form with the values of a jounal that a user wants to edit
const UpdatePost = () => {
  const auth = useContext(AuthContext);
  const postId = useParams().journalId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPost, setLoadedPost] = useState();
  const history = useHistory();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const responseData = await sendRequest(
          `/api/posts/${postId}`
        );
        setLoadedPost(responseData.post);
      } catch (error) {}
    };
    fetchPost();
  }, [sendRequest, postId]);

  const initialValues = {
    title: "",
    content: "",
  };

  const onSubmit = async (values) => {
    try {
      await sendRequest(
        `/api/posts/${postId}`,
        "PATCH",
        JSON.stringify({
          id: auth.userId,
          title: values.title,
          content: values.content,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/" + auth.userId + "/journal");
    } catch (error) {}
  };

  let validationSchema = Yup.object({
    title: Yup.string().required("Journal Title Cannot Be Empty!"),
    content: Yup.string().required("Journal Content Cannot Be Empty!"),
  });

  // Set the formik for form validation
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit,
    validationSchema,
  });

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (loadedPost) {
    initialValues.title = loadedPost[0].title;
    initialValues.content = loadedPost[0].content;
  }

  if (!loadedPost && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find journal!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {!isLoading && loadedPost && (
        <form className="journal-form" onSubmit={formik.handleSubmit}>
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

          <button
            className="form-btn"
            type="submit"
            disabled={!(formik.dirty && formik.isValid)}
          >
            Update Journal
          </button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePost;
