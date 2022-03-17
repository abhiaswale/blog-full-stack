import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ErrorHandler from "../components/ErrorHandler/ErrorHandler";
import Post from "../components/Post/Post";
import AuthContext from "../store/auth-context";
import MessageContext from "../store/message-context";
import { FcSearch } from "react-icons/fc";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CancelIcon from "@mui/icons-material/Cancel";
import Loading from "../components/Loading/Loading";

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
  const search = useRef("");
  const [searchTouched, setSearchTouched] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const pages = new Array(numberOfPages).fill(null);
  let filterBlog;
  const searchUpdate = () => {
    console.log("search function called");
    if (searchTerm.length > 0) {
      console.log(searchTerm);
      filterBlog = posts.filter((p) => {
        return p.title.toLowerCase().includes(searchTerm.toLowerCase());
      });
      console.log(filterBlog);
    }
    if (filterBlog) {
      setPosts(filterBlog);
    }
  };
  const refSet = () => {
    setSearchTerm(search.current.value);
    if (searchTerm.length !== 0) {
      console.log("Search clicked");
      searchHandler();
      setSearchTouched(true);
    } else {
      setSearchError("Search Cannot be empty");
    }
  };

  const searchHandler = () => {
    console.log(searchTerm);
    if (searchTerm.length > 0) {
      searchUpdate();
    }
  };

  useEffect(() => {
    if (!authCtx.token || !authCtx.userId) {
      msgCtx.catchMessage("You have been logged out! Please Login again");
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
        msgCtx.catchMessage(result.message);
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
    console.log(userData.detail.status);
    if (userData.detail.status === status) {
      msgCtx.catchMessage("Please update current status and try again");
      return;
    }
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
    msgCtx.catchMessage(data.message);
    console.log(status);
  };
  let content;
  if (loading) {
    content = <Loading />;
  } else {
    content = (
      <div className="min-h-screen">
        <ErrorHandler error={msgCtx.message} onClose={msgCtx.clearMessage} />
        <section className="flex justify-center items-center">
          <h1 className=" lg:text-6xl text-4xl font-bold my-8">
            Hi <span className="text-green-700">{userData.detail.name}</span>
          </h1>
        </section>
        <div className="mt-18 lg:mx-20 mx-4">
          <form className="w-auto flex lg:justify-center justify-around items-center lg:text-xl text-base">
            <input
              className="p-[7px] lg:w-1/3 w-7/12 border-2 border-slate-700 "
              type="text"
              placeholder="Enter Status"
              defaultValue={userData.detail.status}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
            ></input>
            <button
              onClick={updateStatusHandler}
              className=" ml-2  p-[7px] border-2 border-slate-700 font-semibold "
            >
              Update status
            </button>
          </form>
        </div>
        <div className="flex lg:justify-center justify-between items-center w-auto font-bold p-2 mt-4 ">
          <button
            className="bg-cyan-600 rounded-xl lg:p-3 p-[6px] font-bold lg:mx-10 mx-2 lg:text-xl text-sm lg:w-auto lg:w-42 w-4/12"
            onClick={() => {
              navigate("/postform");
            }}
          >
            NEW POST
          </button>
          <div className="flex justify-center items-center relative lg:w-72 w-2/3">
            <input
              // lg:ml-10 ml-2 lg:mr-6 mr-2 p-2
              className={`lg:w-full p-2 shadow appearance-none border-2 focus:outline-none focus:shadow-outline ${
                searchError ? "border-red-500" : ""
              }`}
              placeholder="Search a Blog"
              ref={search}
              onChange={() => {
                setSearchTouched(true);
                setSearchError(false);
              }}
            ></input>
            {searchTouched && (
              <button
                className="
                leading-4 absolute right-14"
                onClick={() => {
                  search.current.value = "";
                  setSearchTouched(false);
                  postListFetch();
                }}
              >
                <CancelIcon />
              </button>
            )}
            <button
              className="text-3xl absolute right-4"
              onClick={() => {
                refSet();
              }}
            >
              <FcSearch />
            </button>
          </div>
        </div>
        {searchError && <p className="text-center">{searchError}</p>}

        <div className=" flex items-center justify-center">
          {posts && posts.length > 0 && (
            <div className="lg:w-1/2 w-11/12">
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
          )}
          {posts.length === 0 && (
            <p className="font-semibold text-xl my-10">No Posts Found.</p>
          )}
        </div>
        {posts.length > 0 && (
          <section className="flex justify-center items-center font-normal lg:text-lg text:sm my-4">
            <button
              className="bg-white p-1 border-2 border-black mx-2"
              onClick={goToPrevious}
            >
              <NavigateBeforeIcon />
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
              <NavigateNextIcon />
            </button>
          </section>
        )}
      </div>
    );
  }
  return <div>{content}</div>;
};

export default StartingPage;
