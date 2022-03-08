import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Post = (props) => {
  const navigate = useNavigate();
  const editPostHandler = (id) => {
    navigate("/postform", { state: id, editing: true });
  };

  return (
    <div>
      <li key={props._id}>
        <h5>{props.title}</h5>
        <p>{props.description}</p>
        <button
          onClick={() => {
            console.log(props._id.toString());
            navigate(`/post/${props._id}`);
          }}
        >
          View
        </button>
        <button
          onClick={() => {
            editPostHandler(props._id);
          }}
        >
          Edit
        </button>
        <button
          onClick={() => {
            props.onDelete(props._id);
          }}
        >
          Delete
        </button>
      </li>
    </div>
  );
};

export default Post;
