import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import MessageContext from "../../store/message-context";
import ErrorHandler from "../ErrorHandler/ErrorHandler";
const PostForm = () => {
  const authCtx = useContext(AuthContext);
  const msgCtx = useContext(MessageContext);
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
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Cannot get post data ");
        }
        return res.json();
      })
      .then((post) => {
        setTitle(post.post.title);
        setDescription(post.post.description);
        console.log(post.post);
      })
      .catch((err) => {
        console.log(err);
        msgCtx.catchMessage(err);
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
        if (resp.status !== 200 && resp.status !== 201) {
          throw new Error("Something went wrong, please try again");
        }
        return resp.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.message);
        msgCtx.catchMessage(data.message);
        navigate("/startpage");
      })
      .catch((err) => {
        console.log(err);
        msgCtx.catchMessage(err);
      });
  };
  return (
    <div className="mt-10 flex justify-center h-screen">
      <ErrorHandler error={msgCtx.message} onClose={msgCtx.clearMessage} />
      <form
        className="flex items-start justify-center flex-col w-1/2 bg-gray-500 p-6"
        onSubmit={submitHandler}
      >
        <h3 className="font-bold text-xl">Post a blog</h3>
        <label className="font-medium w-full mt-4">TITLE:</label>
        <hr />
        <input
          type="text"
          id="name"
          placeholder="Title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          defaultValue={title}
          className="font-medium w-full p-1"
        ></input>
        <label className="font-medium w-full mt-4">IMAGE</label>
        <input
          type="file"
          name="image"
          id="image"
          className=""
          onChange={fileChangeHandler}
          //   defaultValue={image}
        ></input>
        <div className="w-32 h-32">
          {image && <img className="w-32 h-32" src={preview}></img>}
        </div>
        <label className="font-medium w-full mt-4">CONTENT</label>
        <textarea
          name="description"
          id="description"
          row="10"
          cols="30"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          defaultValue={description}
          className="w-full p-1"
        ></textarea>
        <div className="mt-4">
          <button className="font-bold " type="submit">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;