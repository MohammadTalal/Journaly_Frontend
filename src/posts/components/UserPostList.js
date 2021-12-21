import React, { useState } from "react";
// import { useHistory } from "react-router-dom";
import ReactPaginate from "react-paginate";

import Card from "../../shared/components/UIElements/Card";
import UserPostItem from "./UserPostItem";

import "./PostList.css";

// This component displays a list of UserPostItem
const UserPostList = (props) => {
  // Switch to the add new journal page
  // const history = useHistory();
  // const addNewJounralHandler = () => {
  //   history.push("/journals/new");
  // };

  // Set up the search bar state
  const [searchTerm, setSearchTerm] = useState("");

  // Set up the pagination
  const [pageNumber, setPageNumber] = useState(0);
  const postsPerPage = 5;
  const pagesVisited = pageNumber * postsPerPage;
  const displayPosts = props.items
    .slice(pagesVisited, pagesVisited + postsPerPage)
    .map((post) => {
      return (
        <UserPostItem
          key={post.id}
          id={post.id}
          imageUrl={post.imageUrl}
          title={post.title}
          publishDate={post.publishDate}
          postContent={post.content}
          creatorId={post.creator}
          onDelete={props.onDeletePost}
          display={props.display}
          Delete={props.delete}
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
          <h2>No Journals To Display</h2>
        </Card>
      </div>
    );
  }

  // Return a list of UserPostItem
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
                <UserPostItem
                  key={val.id}
                  id={val.id}
                  imageUrl={val.imageUrl}
                  title={val.title}
                  publishDate={val.publishDate}
                  postContent={val.content}
                  creatorId={val.creator}
                  display={props.display}
                  Delete={props.delete}
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

export default UserPostList;
