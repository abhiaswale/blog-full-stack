import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";

const SinglePost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [postItem, setPostItem] = useState({});
  const [postImage, setPostImage] = useState();
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let content;
  if (loading) {
    content = <Loading />;
  } else {
    content = (
      <div className="mt-10 lg:w-auto">
        <h1 className="lg:text-3xl text-2xl text-center font-semibold my-1 mx-6">
          {postItem.title}
        </h1>
        <p className="lg:text-lg text-base text-center my-4 mx-2">
          {postItem.description}
        </p>
        <div className="flex justify-center items-center my-4">
          <img className="lg:w-1/3 h-auto" src={postImage} alt="image"></img>
        </div>
        <div className="flex justify-center items-center">
          <button
            className="p-[2px] px-3 font-bold border-2 border-black my-3"
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
