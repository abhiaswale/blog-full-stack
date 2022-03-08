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

  let editPost = {
    title: "",
    description: "",
  };
  const editPostId = location.state;
  console.log(location.state);
  const startEditPost = (editPostId) => {
    setIsEditing(true);
    fetch(`http://localhost:8080/user/post/${editPostId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((post) => {
        editPost = post.post;
        console.log(editPost);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (location.state) {
      startEditPost(editPostId);
    }
  });

  const submitHandler = (e) => {
    e.preventDefault();
    let url = "http://localhost:8080/user/post";
    let method = "POST";
    if (isEditing) {
      url = `http://localhost:8080/user/post/${editPostId}`;
    }
    fetch(url, {
      method: method,
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
          value={editPost.title}
        ></input>
        <textarea
          name="description"
          id="description"
          row="6"
          cols="20"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          value={editPost.description}
        ></textarea>
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default PostForm;
