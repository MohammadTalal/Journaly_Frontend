import React, { useState, useEffect } from "react";

import PostList from "../components/PostList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import axios from "axios";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AllPosts = () => {
  const [loadedPosts, setLoadedPosts] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  const endDateFormat = moment(endDate).format("YYYY-MM-DD");
  const startDateFormat = moment(startDate).format("YYYY-MM-DD");

  let { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest("/api/posts");
        setLoadedPosts(responseData.posts);
        setFilteredPosts(responseData.posts);
        // setFilteredPosts(responseData.posts);
      } catch (error) {}
    };
    fetchPosts();
  }, [sendRequest]);
  // This function handle the filter post functionality
  const filterPostsByDate = async () => {
    if (endDate === "") {
      return;
    }
    if (startDate === "") {
      return;
    }
    try {
      const formData = {
        startDateFormat,
        endDateFormat,
      };
      await axios
        .post(`/api/posts/filter`, formData)
        .then((res) => {
          setFilteredPosts(res.data.result);
        })
        .catch((err) => console.log(err));
    } catch (error) {}
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {loadedPosts === "" ? null : (
        <section className="Date-picker-wrapper post-list">
          <div className="Date-picker">
            {/* This is start data */}

            <DatePicker
              onChange={setStartDate}
              value={startDate}
              selected={startDate}
              dateFormat="dd/MM/yyyy"
              placeholderText="Enter The Start Date"
              className="startdate"
              maxDate={new Date()}
            />
            <p className="to">to</p>
            {/* This is end Date */}
            <DatePicker
              onChange={setEndDate}
              value={endDate}
              selected={endDate}
              dateFormat="dd/MM/yyyy"
              placeholderText="Enter The End Date"
              className="enddate"
              maxDate={new Date()}
            />
            <button
              className="filter-btn"
              onClick={() => filterPostsByDate()}
              disabled={endDate === "" && startDate === "" ? true : false}
            >
              Filter
            </button>
          </div>
        </section>
      )}

      {!isLoading && loadedPosts && (
        <PostList
          items={filteredPosts.length !== 0 ? loadedPosts : filteredPosts}
        />
      )}
    </React.Fragment>
  );
};

export default AllPosts;
