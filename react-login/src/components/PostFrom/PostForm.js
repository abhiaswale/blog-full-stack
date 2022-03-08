import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
const PostForm = () => {
  const authCtx = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();
  //   setIsEditing(location.editing);
  console.log(location.props);

  const submitHandler = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/user/post", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + authCtx.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        navigate("/startpage");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <h3>Post a blog</h3>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          id="name"
          placeholder="Title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
        ></input>
        <textarea
          name="description"
          id="description"
          row="6"
          cols="20"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          value={description}
        ></textarea>
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default PostForm;
