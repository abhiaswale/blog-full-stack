import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Post from "../components/Post/Post";
import AuthContext from "../store/auth-context";

const StartingPage = (props) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  // const [pageNumber, setPageNumber] = useState(1);
  // const [numberOfPages, setNumberOfPages] = useState(1);

  // const pages = new Array(numberOfPages).fill(null);

  useEffect(() => {
    fetch("http://localhost:8080/user/detail", {
      headers: {
        Authorization: "Bearer " + authCtx.token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        console.log(data);
        setLoading(false);
      });
  }, []);

  const postListFetch = async () => {
    fetch("http://localhost:8080/user/post", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authCtx.token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setPosts(data.data);
        // setNumberOfPages(data.pages);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    postListFetch();
  }, []);

  const deleteHandler = (id) => {
    console.log(id);
    fetch(`http://localhost:8080/user/post/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPosts((prevData) => {
          const updatedPosts = prevData.filter((p) => p._id !== id);
          return updatedPosts;
        });
      });
  };
  let content;
  if (loading) {
    content = <h1>Loading...</h1>;
  } else {
    content = (
      <div>
        <h1 className="text-6xl font-bold my-8">hi {userData.detail.name}</h1>
        <div className="mt-52 mx-20">
          <form>
            <input type="text" placeholder="Enter Status"></input>
            <button>Update status</button>
          </form>
        </div>
        <button
          onClick={() => {
            navigate("/postform");
          }}
        >
          New Post
        </button>
        <section>
          {posts.map((post) => (
            <Post
              key={post._id}
              _id={post._id}
              title={post.title}
              description={post.description}
              onDelete={deleteHandler}
            />
          ))}
        </section>
        {/* {pages.map((val, index) => (
          <button onClick={setPageNumber(index + 1)}>{index + 1}</button>
        ))} */}
      </div>
    );
  }
  return <div>{content}</div>;
};

export default StartingPage;
