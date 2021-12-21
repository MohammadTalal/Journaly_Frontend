import React, { useRef, useEffect } from "react";

import "./CommentCard.css";

// The post header includes user image, and user name.
const CommentsCard = ({ comments }) => {
  //I used useRef hook and scrollTOBottom function becasue I want when user enter the comment
  //  it must show at last of the message means bottom of the message
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  return (
    <div className="comment-box">
      {/* if there is no post then shows a message otherwise shows all comment of that post */}
      {comments.length === 0 ? (
        <p className="empty">This post not commented yet</p>
      ) : (
        comments.map((comment, index) => {
          return (
            <div className="comments" key={index} ref={messagesEndRef}>
              <div>
                <p className="user">{comment.name}</p>
                <p className="message">{comment.comment}</p>
              </div>
              <hr />
            </div>
          );
        })
      )}
    </div>
  );
};

export default CommentsCard;
