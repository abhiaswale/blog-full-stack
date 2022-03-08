import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Post = (props) => {
  const navigate = useNavigate();
  const editPostHandler = (id) => {
    navigate("/postform", { updationId: id, editing: true });
  };
  const deleteHandler = (id) => {
    fetch(`http://localhost:8080/user/post/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      });
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
        {/* <button
          onClick={() => {
            editPostHandler(props._id);
          }}
        >
          Edit
        </button> */}
        <button>
          <Link to="/postform" props={"props._id"}>
            Edit
          </Link>
        </button>
        <button
          onClick={() => {
            // deleteHandler(props._id);
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
