import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import Modal from "../../shared/components/UIElements/Modal";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-form-context";
import CommentsCard from "./CommentsCard";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./PostItem.css";
import { Link } from "react-router-dom";

const UserPostItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCommentConfirmModal, setShowCommentConfirmModal] = useState(false);

  let validationSchema = Yup.object({
    comment: Yup.string().required("Journal Comment Cannot Be Empty!"),
  });

  const formik = useFormik({
    enableReinitialize: true,

    validationSchema,
  });

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const showCommmentModal = () => {
    setShowCommentConfirmModal(true);
  };
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };
  const cancelCommentHandler = () => {
    setShowCommentConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(`/api/posts/${props.id}`, "DELETE", null, {
        Authorization: "Bearer " + auth.token,
      });
      RemoveFavouriteWhenPostDelete();
      props.onDelete(props.id);
    } catch (error) {}
  };

  const RemoveFavouriteWhenPostDelete = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        "/api/favourites/deletewithpost",
        "DELETE",
        JSON.stringify({
          postId: props.id,
          userId: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (error) {}
  };

  // This function only remove favourites posts from favourites table by clicking the delete button from favourite section
  const RemoveFavourite = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        "/api/favourites/favourite",
        "DELETE",
        JSON.stringify({
          postId: props.id,
          userId: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (error) {}
  };
  // this functional handle the comment submission

  const commentSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await sendRequest(
        "/api/comments",
        "POST",
        JSON.stringify({
          postId: props.id,
          userId: auth.userId,
          comment: comment,
          username: "test",
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      // setComments fetch all comments and store it comments letiable
      setComments(res.comments);

      // setComment shows input field of the comment section after submission the input field will be empty
      setComment("");
    } catch (error) {
      alert("error");
    }
  };
  //handle the comment input
  const commentHandleInput = (e) => {
    setComment(e.target.value);
  };
  useEffect(() => {
    async function fetchComment() {
      try {
        const res = await sendRequest(`/api/comments/${props.id}`);
        setComments(res.comments);
      } catch (error) {}
    }
    fetchComment();
  }, [sendRequest, props.id]);
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="post-item__modal-actions"
        footer={
          <React.Fragment>
            <button className="form-btn" onClick={cancelDeleteHandler}>
              CANCEL
            </button>
            <button
              className="form-btn"
              onClick={props.Delete ? RemoveFavourite : confirmDeleteHandler}
            >
              DELETE
            </button>
          </React.Fragment>
        }
      >
        <p>Are you sure you want to delete this journal?</p>
      </Modal>
      <li className="post-item">
        <Modal
          show={showCommentConfirmModal}
          onCancel={cancelDeleteHandler}
          header="Comments"
          footerClass="post-item__modal-actions"
          footer={
            <React.Fragment>
              <button
                className="form-btn"
                style={{ marginTop: "0px" }}
                onClick={cancelCommentHandler}
              >
                CANCEL
              </button>
            </React.Fragment>
          }
        >
          <div className="all-comments">
            <CommentsCard comments={comments} />
          </div>
          {/* <ErrorModal error={error} onClear={clearError} /> */}
          {auth.isSignedIn ? (
            <form>
              {isLoading && <LoadingSpinner asOverlay />}
              <label htmlFor="comment">Comment:</label>
              <input
                className="form-control"
                type="text"
                id="comment"
                name="comment"
                value={comment}
                autoComplete="off"
                onChange={commentHandleInput}
              />
              <div className="error">
                {formik.touched.comment && formik.errors.comment ? (
                  <div>{formik.errors.comment}</div>
                ) : null}
              </div>

              <button
                className="form-btn"
                style={{ marginTop: "0px" }}
                onClick={commentSubmitHandler}
                disabled={comment.length === "" ? true : false}
              >
                Post
              </button>
            </form>
          ) : null}
        </Modal>
        <Card className="post-item__content">
          {isLoading && <LoadingSpinner />}
          {props.imageUrl && (
            <div className="post-item__image">
              <img src={`${props.imageUrl}`} alt={props.title} />
            </div>
          )}
          <div className="post-item__info">
            <h2>
              {props.title} | {moment(props.publishDate).format("MMMM Do YYYY")}
            </h2>
            <p>{props.postContent}</p>
          </div>
          <div className="post-item__actions">
            <div
              className="post__option"
              style={{ display: `${props.display}` }}
            >
              <Link className="links" to={`/journals/${props.id}`}>
                <button className="button-17">EDIT</button>
              </Link>
            </div>
            <div className="post__option">
              <button className="button-17" onClick={showDeleteWarningHandler}>
                DELETE
              </button>
            </div>
            <div
              className="post__option"
              style={{ display: `${props.display}` }}
            >
              <button className="button-17" onClick={() => showCommmentModal()}>
                COMMENTS
              </button>
            </div>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default UserPostItem;
