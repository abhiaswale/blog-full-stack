import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
const PostForm = () => {
  const authCtx = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const editPostId = location.state;
  const startEditPost = (postId) => {
    setIsEditing(true);
    fetch(`http://localhost:8080/user/post/${postId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((post) => {
        setTitle(post.post.title);
        setDescription(post.post.description);
        console.log(post.post);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (location.state) {
      startEditPost(editPostId);
    }
  }, [editPostId]);

  const fileChangeHandler = (e) => {
    console.log(e.target.files[0]);
    if (e.target && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [image]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    let url = "http://localhost:8080/user/post";
    let method = "POST";
    if (isEditing) {
      url = `http://localhost:8080/user/post/${editPostId}`;
      method = "PUT";
    }
    fetch(url, {
      method: method,
      body: formData,
      headers: {
        Authorization: "Bearer " + authCtx.token,
      },
    })
      .then((resp) => {
        return resp.json();
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
      <form
        className="flex justify-center items-center flex-col"
        onSubmit={submitHandler}
      >
        <input
          type="text"
          id="name"
          placeholder="Title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          defaultValue={title}
          className="mt-5"
        ></input>
        <label>Choose a image</label>
        <input
          type="file"
          name="image"
          id="image"
          className="mt-5"
          onChange={fileChangeHandler}
          //   defaultValue={image}
        ></input>
        {image && <img src={preview}></img>}
        <textarea
          name="description"
          id="description"
          row="6"
          cols="20"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          defaultValue={description}
          className="mt-5"
        ></textarea>
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default PostForm;
