import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ErrorHandler from "../components/ErrorHandler/ErrorHandler";
import Post from "../components/Post/Post";
import AuthContext from "../store/auth-context";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import MessageContext from "../store/message-context";

const StartingPage = (props) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const msgCtx = useContext(MessageContext);
  const [userData, setUserData] = useState(null);
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const pages = new Array(numberOfPages).fill(null);

  const date = new Date();
  const wishHour = date.getHours();
  let wishMessage;
  if (wishHour >= 5 && wishHour < 12) {
    wishMessage = "Good Morning";
  } else if (wishHour >= 12 && wishHour < 17) {
    wishMessage = "Good Afternoon";
  } else if (wishHour >= 17 && wishHour < 21) {
    wishMessage = "Good Evening";
  } else {
    wishMessage = "Good Night";
  }

  let filterBlog;
  const searchUpdate = () => {
    filterBlog = posts.filter((p) => {
      return p.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setPosts(filterBlog);
  };

  // useEffect(() => {
  // }, [filterBlog]);

  useEffect(() => {
    if (!authCtx.token || !authCtx.userId) {
      alert("You have been logged out");
      navigate("/");
      setLoading(true);
      return;
    }
    if (localStorage.getItem("expiryDate") <= new Date()) {
      authCtx.logout();
    }
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
        setStatus(data.detail.status);
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        msgCtx.catchMessage(err);
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
        msgCtx.catchMessage(err);
      });
  };
  useEffect(() => {
    postListFetch();
  }, [pageNumber]);

  //PAGINATION LOGIC
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
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Cannot delete product, Please try again");
        }
        return res.json();
      })
      .then((result) => {
        setPosts((prevData) => {
          const updatedPosts = prevData.filter((p) => p._id !== id);
          return updatedPosts;
        });
      })
      .catch((err) => {
        msgCtx.catchMessage(err);
      });
  };

  const updateStatusHandler = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/user/status", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + authCtx.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status,
      }),
    });

    const data = await res.json();
    console.log(data);
    console.log(status);
  };
  let content;
  if (loading) {
    content = (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  } else {
    content = (
      <div>
        <ErrorHandler error={msgCtx.message} onClose={msgCtx.clearMessage} />
        <h1 className="text-6xl font-bold my-8">
          Hi <span className="text-green-700">{userData.detail.name}</span>
        </h1>

        <div className="mt-18 mx-20">
          <form className="flex justify-center items-center text-xl">
            <input
              className="p-2 w-1/3 border-2 border-slate-700 "
              type="text"
              placeholder="Enter Status"
              defaultValue={userData.detail.status}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
            ></input>
            <button
              onClick={updateStatusHandler}
              className="ml-2 p-2 border-2 border-slate-700 font-semibold"
            >
              Update status
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center text-xl font-bold p-2 mt-4">
          <button
            className="bg-cyan-600 rounded-xl p-3 font-bold mx-10"
            onClick={() => {
              navigate("/postform");
            }}
          >
            NEW POST
          </button>
          <input
            className="mx-10 p-2"
            placeholder="Search a Blog"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              searchUpdate();
            }}
          ></input>
        </div>
        <div className=" flex items-center justify-center">
          <div className="w-1/2">
            {posts.map((post) => (
              <Post
                key={post._id}
                _id={post._id}
                title={post.title}
                description={post.description}
                creator={post.creator._id}
                creatorName={post.creator.name}
                createdAt={post.createdAt}
                name={post.name}
                onDelete={deleteHandler}
              />
            ))}
          </div>
        </div>
        <section className="flex justify-center items-center font-normal text-lg my-4">
          <button
            className="bg-white p-1 border-2 border-black mx-2"
            onClick={goToPrevious}
          >
            Previous
          </button>
          {pages.map((val, index) => (
            <button
              className="bg-white px-3 py-1 border-2 border-black mx-2"
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
