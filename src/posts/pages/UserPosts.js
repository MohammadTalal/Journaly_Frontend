import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import UserPostList from "../components/UserPostList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/UIElements/Card";

const UserPosts = () => {
  const [loadedPosts, setLoadedPosts] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          `/api/posts/user/${userId}`
        );
        setLoadedPosts(responseData.posts);
      } catch (error) {}
    };
    fetchPosts();
  }, [sendRequest, userId]);

  // Switch to the add new journal page
  const history = useHistory();
  const addNewJounralHandler = () => {
    history.push("/journals/new");
  };

  const postDeletedHandler = (deletedPostId) => {
    setLoadedPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPostId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && !loadedPosts && (
        <div className="center">
          <Card>
            <h2>No Journals To Display</h2>
            <button
              className="form-btn"
              type="submit"
              onClick={addNewJounralHandler}
            >
              Add New Journal
            </button>
          </Card>
        </div>
      )}
      {!isLoading && loadedPosts && (
        <UserPostList items={loadedPosts} onDeletePost={postDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPosts;
