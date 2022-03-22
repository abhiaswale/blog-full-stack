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
  const [imgFile, setImgFile] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const editPostId = location.state;
  const startEditPost = (postId) => {
    setIsEditing(true);
    fetch(`https://blog-app05.herokuapp.com/user/post/${postId}`, {
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
        // setImage(post.post.imageUrl);
        setImgFile(post.post.imageUrl);
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
  }, []);

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
    if (!title) {
      setErrorMsg("Title cannot be empty");
      return;
    }
    console.log(imgFile);

    if (!description) {
      setErrorMsg("Description cannot be empty");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (isEditing && !image) {
      formData.append("image", imgFile);
    }
    formData.append("image", image);

    let url = "https://blog-app05.herokuapp.com/user/post";
    let method = "POST";
    if (isEditing) {
      url = `https://blog-app05.herokuapp.com/user/post/${editPostId}`;
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
    <div className="mt-6 flex justify-center">
      <ErrorHandler error={msgCtx.message} onClose={msgCtx.clearMessage} />
      <form
        className="shadow-2xl flex items-start justify-center flex-col lg:w-1/2 w-11/12 p-6"
        onSubmit={submitHandler}
      >
        <h3 className="font-bold lg:text-2xl text-xl">Post a blog</h3>
        {errorMsg && <p>{errorMsg}</p>}
        <label className="font-medium lg:text-base text-sm  w-full mt-4">
          TITLE
        </label>
        <input
          type="text"
          id="name"
          placeholder="Title"
          onChange={(e) => {
            setTitle(e.target.value);
            setErrorMsg(null);
          }}
          defaultValue={title}
          className="shadow appearance-none focus:outline-none focus:shadow-outline mt-2 font-medium lg:text-base text-sm w-full p-1"
        ></input>
        <label className="font-medium lg:text-base text-sm w-full mt-4">
          IMAGE
        </label>
        <input
          type="file"
          name="image"
          id="image"
          className="mt-2 p-1"
          onChange={(e) => {
            fileChangeHandler(e);
            setErrorMsg(null);
          }}
        ></input>
        <div className="w-32 h-32">
          {image && (
            <img className="w-32 h-32" alt="PostImage" src={preview}></img>
          )}
        </div>
        <label className="font-medium lg:text-base text-sm w-full mt-4">
          DESCRIPTION
        </label>
        <textarea
          name="description"
          id="description"
          placeholder="Description"
          row="40"
          cols="30"
          onChange={(e) => {
            setDescription(e.target.value);
            setErrorMsg(null);
          }}
          defaultValue={description}
          className="shadow appearance-none focus:outline-none lg:text-base text-sm focus:shadow-outline w-full mt-2 p-1 h-32"
        ></textarea>
        <div className="mt-4">
          <button
            className="p-[2px] px-3 font-bold border-2 border-black"
            type="submit"
          >
            Post
          </button>
          <button
            className="p-[2px] px-3 mx-2 font-bold border-2 border-black"
            type="submit"
            onClick={() => {
              navigate("/startpage");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
