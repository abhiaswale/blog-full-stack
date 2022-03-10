import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ErrorHandler from "../components/ErrorHandler/ErrorHandler";
import Post from "../components/Post/Post";
import AuthContext from "../store/auth-context";

const StartingPage = (props) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);

  const pages = new Array(numberOfPages).fill(null);

  const catchError = (errror) => {
    setError(errror);
  };
  const errorHandler = () => {
    setError(null);
  };

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
  }, [authCtx.token]);

  const postListFetch = async () => {
    fetch("http://localhost:8080/user/post?page=" + pageNumber, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authCtx.token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch posts.");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setPosts(data.data);
        setNumberOfPages(data.pages);
        console.log(data.data);
      })
      .catch((err) => {
        console.log(err);
        catchError(err);
      });
  };
  useEffect(() => {
    postListFetch();
  }, [pageNumber]);

  const pageHandler = (i) => {
    setPageNumber(i + 1);
  };
  const goToPrevious = () => {
    setPageNumber(Math.max(1, pageNumber - 1));
  };
  const goToNext = () => {
    setPageNumber(Math.min(numberOfPages, pageNumber + 1));
  };

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
        <ErrorHandler error={error} onClose={errorHandler} />
        <h1 className="text-6xl font-bold my-8">Hi {userData.detail.name}</h1>
        <div className="mt-20 mx-20">
          <form className="flex justify-center items-center text-xl">
            <input
              className="p-2 w-1/3"
              type="text"
              placeholder="Enter Status"
            ></input>
            <button className="p-2 ">Update status</button>
          </form>
        </div>
        <div className="flex justify-center items-center text-xl font-bold p-2 mt-4">
          <button
            className="bg-cyan-600 rounded-xl p-3 font-bold"
            onClick={() => {
              navigate("/postform");
            }}
          >
            NEW POST
          </button>
        </div>
        <div className=" flex items-center justify-center">
          <div className="w-1/2">
            {posts.map((post) => (
              <Post
                key={post._id}
                _id={post._id}
                title={post.title}
                description={post.description}
                creator={post.creator}
                createdAt={post.createdAt}
                name={post.name}
                onDelete={deleteHandler}
              />
            ))}
          </div>
        </div>
        <section className="flex justify-center items-center font-normal text-lg">
          <button
            className="bg-white p-1 border-2 border-black mx-2"
            onClick={goToPrevious}
          >
            Previous
          </button>
          {pages.map((val, index) => (
            <button
              className="bg-white px-3 border-2 border-black mx-2"
              key={index}
              onClick={() => {
                pageHandler(index);
              }}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="bg-white p-1 border-2 border-black mx-2"
            onClick={goToNext}
          >
            Next
          </button>
        </section>
      </div>
    );
  }
  return <div>{content}</div>;
};

export default StartingPage;
