import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { useFormik } from "formik";
import * as Yup from "yup";
import Card from "../../shared/components/UIElements/Card";
import PostHeader from "./PostHeader";
import { AuthContext } from "../../shared/context/auth-form-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Modal from "../../shared/components/UIElements/Modal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import CommentsCard from "./CommentsCard";

// react-icons
import { BsHeartFill } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";

import { VscComment } from "react-icons/vsc";
//stylesheet
import "./PostItem.css";

const PostItem = (props) => {
  const auth = useContext(AuthContext);

  const { sendRequest, isLoading } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [Disabled, setLikeDisabled] = useState(false);
  const [DisabledFavourite, setFavouriteDisabled] = useState(false);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [getlikes, setGetLikes] = useState(0);

  const showCommentHandlerModal = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
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
          username: props.username,
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

  let validationSchema = Yup.object({
    comment: Yup.string().required("Journal Comment Cannot Be Empty!"),
  });

  const formik = useFormik({
    enableReinitialize: true,

    validationSchema,
  });
  //handle favourite submission
  // This function is used to add user to favourite post from favourites table

  const AddFavourite = async () => {
    try {
      const res = await sendRequest(
        "/api/favourites",
        "POST",
        JSON.stringify({
          userId: auth.userId,
          postId: props.id,
          title: props.title,
          content: props.postContent,
          username: props.username,
          publishDate: props.publishDate,
          imageUrl: props.imageUrl,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      // setFavouriteDisabled(res.disable); this set favourite or not

      setFavouriteDisabled(res.disable);
    } catch (error) {}
  };
  // This function is used to Remove user from favourite post from favourites table
  const RemoveFavourite = async () => {
    try {
      const res = await sendRequest(
        "/api/favourites",
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

      // setFavouriteDisabled(res.disable); this set favourite or not

      setFavouriteDisabled(res.disable);
    } catch (error) {}
  };

  //handle like submission

  const likePostHandler = async () => {
    try {
      const res = await sendRequest(
        "/api/likes",
        "POST",
        JSON.stringify({
          postId: props.id,
          userId: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      //fetchLikecheck(); this function call and get latest likes from the database likes table
      fetchLikecheck();
      // setGetLikes(res.res); this set all latest likes so that we can shows that on users screen
      setGetLikes(res.res);
    } catch (error) {}
  };

  //handle unlike submission

  const unlikePostHandler = async () => {
    try {
      const res = await sendRequest(
        "/api/likes",
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
      //fetchLikecheck(); this function call and get latest likes from the database likes table

      fetchLikecheck();
      // setGetLikes(res.res); this set all latest likes so that we can shows that on users screen

      setGetLikes(res.res);
    } catch (error) {}
  };
  //check weather post has been liked or not
  const fetchLikecheck = async () => {
    try {
      const responseData2 = await sendRequest(
        `/api/likes/${auth.userId}/${props.id}`
      );
      //if we get the post has been already liked then it return true when it return true
      // it means the like buttn of that post turn into unlike button
      setLikeDisabled(responseData2.disable);
    } catch (error) {}
  };
  // this function check and fetch likes of all post and shows on the screen
  useEffect(() => {
    const fetchLikecheck = async () => {
      try {
        const responseData2 = await sendRequest(
          `/api/likes/${auth.userId}/${props.id}`
        );
        //if we get the post has been already liked then it return true when it return true
        // it means the like buttn of that post turn into unlike button
        setLikeDisabled(responseData2.disable);
      } catch (error) {}
    };
    fetchLikecheck();
  }, [sendRequest, auth.userId, props.id]);
  // this function fetch the count of likes of every post
  useEffect(() => {
    async function countLikes() {
      try {
        const res = await sendRequest(`/api/likes/${props.id}`);
        setGetLikes(res.likeslength);
      } catch (error) {}
    }
    countLikes();
  }, [sendRequest, props.id]);
  // this function fetch comments of every post sepratelly
  useEffect(() => {
    async function fetchComment() {
      try {
        const res = await sendRequest(`/api/comments/${props.id}`);
        setComments(res.comments);
      } catch (error) {}
    }
    fetchComment();
  }, [sendRequest, props.id]);

  // this function check and fetch likes of all post and shows on the screen
  useEffect(() => {
    const fetchFavouritecheck = async () => {
      try {
        const responseData2 = await sendRequest(
          `/api/favourites/${auth.userId}/${props.id}`
        );
        //if we get the post has been already liked then it return true when it return true
        // it means the like buttn of that post turn into unlike button
        setFavouriteDisabled(responseData2.disable);
      } catch (error) {}
    };
    fetchFavouritecheck();
  }, [sendRequest, auth.userId, props.id]);

  //handle the comment input
  const commentHandleInput = (e) => {
    setComment(e.target.value);
  };
  console.log(comment.length);
  return (
    <li className="post-item">
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Comments"
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
        <div className="post-header">
          {/* this user name come from database from post table where field is username */}
          <PostHeader
            username={props.postusername}
            userImage={props.userimage}
          />
        </div>
        {props.imageUrl === null ? null : (
          <div className="post-item__image">
            <img src={`${props.imageUrl}`} alt={props.comment} />
          </div>
        )}
        <div className="post-item__info">
          <h2>
            {props.title} | {moment(props.publishDate).format("MMMM Do YYYY")}
          </h2>
          <p>{props.postContent}</p>
        </div>
        <div
          className="post-item__likes"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <p className="likes-number">
            {getlikes === 0 ? (
              <div className="set-icons">
                <AiOutlineLike style={{ fontSize: "25px", color: "gray" }} />
                {getlikes}
              </div>
            ) : (
              <div className="set-icons">
                <AiOutlineLike style={{ fontSize: "25px", color: "#174ea6" }} />
                {getlikes}
              </div>
            )}
          </p>
          <p
            className="likes-number"
            style={{
              marginRight: "5px",
              display: `${auth.isSignedIn ? "block" : "none"}`,
            }}
          >
            {DisabledFavourite ? (
              <BsHeartFill
                style={{ fontSize: "25px", color: "red" }}
                onClick={() => RemoveFavourite()}
              />
            ) : (
              <BsHeartFill
                style={{ fontSize: "25px", color: "gray" }}
                onClick={() => AddFavourite()}
              />
            )}
          </p>
          <p className="likes-number" style={{ marginRight: "5px" }}>
            {comments.length === 0 ? (
              <div className="set-icons">
                {comments.length}
                <VscComment style={{ fontSize: "25px", color: "gray" }} />
              </div>
            ) : (
              <div className="set-icons">
                {comments.length}
                <VscComment style={{ fontSize: "25px", color: "#174ea6" }} />
              </div>
            )}
          </p>
        </div>
        <div className="post-item__actions">
          <div className="post__option">
            {Disabled ? (
              <button
                className="button-17"
                onClick={auth.isSignedIn ? unlikePostHandler : null}
              >
                Unlike
              </button>
            ) : (
              <button
                className="button-17"
                onClick={auth.isSignedIn ? likePostHandler : null}
              >
                Like
              </button>
            )}
          </div>
          {/* <div className="post__option">
            <Button onClick={likePostHandler}>Favourite</Button>
          </div> */}

          <div className="post__option">
            <button className="button-17" onClick={showCommentHandlerModal}>
              Comment
            </button>
          </div>
        </div>
      </Card>
    </li>
  );
};

export default PostItem;
