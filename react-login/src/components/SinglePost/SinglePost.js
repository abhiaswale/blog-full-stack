import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SinglePost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [postItem, setPostItem] = useState({});
  const [postImage, setPostImage] = useState();
  useEffect(() => {
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
        console.log(post.post);
        setPostItem(post.post);
        setPostImage("http://localhost:8080/" + post.post.imageUrl);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let content;
  if (!postItem) {
    content = <h3>Loading....</h3>;
  } else {
    content = (
      <div className="mt-10">
        <h1 className="text-3xl text-center font-semibold my-2">
          {postItem.title}
        </h1>
        <p className="text-lg text-center my-2">{postItem.description}</p>
        <div className="flex justify-center items-center my-2">
          <img className="w-1/3 h-auto" src={postImage} alt="image"></img>
        </div>
        <div className="flex justify-center items-center">
          <button
            className="text-lg font-semibold border-2 p-1"
            onClick={() => {
              navigate("/startpage");
            }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }
  return <div>{content}</div>;
};

export default SinglePost;
