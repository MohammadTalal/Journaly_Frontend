import React, { useEffect, useState, useContext } from "react";
import ReactPaginate from "react-paginate";

import PostItem from "./PostItem";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-form-context";
import "./PostList.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
// This component displays a list of PostItem
const PostList = (props) => {
  //get auth Id from authContext
  const auth = useContext(AuthContext);
  // Set up the search bar state
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState("");
  const [, setUserImage] = useState("");

  //get  user name and image from user table so that we can show it on the Post Header (name and image)
  const { sendRequest } = useHttpClient();

  useEffect(() => {
    async function fetchUserName() {
      try {
        const res = await sendRequest(
          `/api/users/${auth.userId}`
        );
        setUsername(res.username[0].name);
        setUserImage(res.username[0].imageUrl);
      } catch (error) {}
    }
    fetchUserName();
  }, [sendRequest, auth.userId]);

  // Set up the pagination
  const [pageNumber, setPageNumber] = useState(0);
  const postsPerPage = 5;
  const pagesVisited = pageNumber * postsPerPage;
  const displayPosts = props.items
    .slice(pagesVisited, pagesVisited + postsPerPage)
    .map((post) => {
      return (
        <PostItem
          key={post.id}
          id={post.id}
          imageUrl={post.imageUrl}
          title={post.title}
          publishDate={post.publishDate}
          postContent={post.content}
          creatorId={post.userId}
          username={username}
          userimage={post.userimageUrl}
          postusername={post.username}
        />
      );
    });
  const pageCount = Math.ceil(props.items.length / postsPerPage);
  const changePageHandler = ({ selected }) => {
    setPageNumber(selected);
  };
  // Check if there is no journals to display
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No Journals To Display. Please Check Back Later</h2>
        </Card>
      </div>
    );
  }

  // Return a list of PostItem
  return (
    <ul className="post-list">
      <input
        className="search-bar"
        type="text"
        placeholder="Search For A Journal By Title..."
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />

      {/* Date Picker for select date for filtering */}
      {/* the styling of this section whitin index.csss */}

      {searchTerm === "" && displayPosts}
      {
        // Filter for journals by title
        searchTerm !== "" &&
          props.items
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.title.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return val;
              } else {
                return null;
              }
            })
            .map((val) => {
              return (
                <PostItem
                  key={val.id}
                  id={val.id}
                  imageUrl={val.imageUrl}
                  title={val.title}
                  publishDate={val.publishDate}
                  postContent={val.content}
                  creatorId={val.userId}
                  userimage={val.userimageUrl}
                  postusername={val.username}
                />
              );
            })
      }

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePageHandler}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </ul>
  );
};

export default PostList;
