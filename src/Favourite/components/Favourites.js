import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserPostList from "../../posts/components/UserPostList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-form-context";
const UserPosts = () => {
  const [loadedPosts, setLoadedPosts] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  // this check which posts are added to wishlist then shows it on screen

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          `/api/favourites/${auth.userId}`,
          "GET"
        );
        setLoadedPosts(responseData.favourites);
      } catch (error) {}
    };
    fetchPosts();
  }, [sendRequest, auth.userId]);

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
            <h2>No Journals To Favourites</h2>
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
      {/* Here I passed some props because I want different things in UserPostList component */}
      {/* because we need different things in favourites section */}
      {!isLoading && loadedPosts && (
        <UserPostList
          items={loadedPosts}
          onDeletePost={postDeletedHandler}
          display="none"
          delete={true}
        />
      )}
    </React.Fragment>
  );
};

export default UserPosts;
