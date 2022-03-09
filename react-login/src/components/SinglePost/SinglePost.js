import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SinglePost = () => {
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
        console.log(post);
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
      <div>
        SinglePost : {postId}
        <h1>{postItem.title}</h1>
        <img src={postImage} alt="image"></img>
      </div>
    );
  }
  return <div>{content}</div>;
};

export default SinglePost;
