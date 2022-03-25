import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ErrorHandler from "../components/ErrorHandler/ErrorHandler";
import Post from "../components/Post/Post";
import AuthContext from "../store/auth-context";
import MessageContext from "../store/message-context";
import { FcSearch } from "react-icons/fc";
import CancelIcon from "@mui/icons-material/Cancel";
import Loading from "../components/Loading/Loading";
import Pagination from "../components/Pagination/Pagination";

import Footer from "../components/Footer/Footer";

const StartingPage = (props) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const msgCtx = useContext(MessageContext);
  //USER DATA STATES
  const [userData, setUserData] = useState(null);
  const [status, setStatus] = useState();
  //LOADING STATES
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  //POST
  const [posts, setPosts] = useState([]);
  //  PAGINATION STATES
  const [pageNumber, setPageNumber] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);
  //SEARCH STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTouched, setSearchTouched] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // const pages = new Array(props.numberOfPages).fill(null);

  let filterBlog;
  const searchUpdate = () => {
    if (searchTerm.length > 0) {
      filterBlog = posts.filter((p) => {
        return p.title.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    if (filterBlog) {
      setPosts(filterBlog);
    }
  };

  const refSet = () => {
    if (searchTerm.length !== 0) {
      searchUpdate();
      setSearchTouched(true);
    } else {
      setSearchError("Search Cannot be empty");
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
    fetch("https://blog-app05.herokuapp.com/user/detail", {
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
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        msgCtx.catchMessage(err);
      });
  }, [authCtx.token]);

  const postListFetch = async () => {
    setPostsLoading(true);
    fetch("https://blog-app05.herokuapp.com/user/post?page=" + pageNumber, {
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
        setPosts(data.data);
        setNumberOfPages(data.pages);
        setPostsLoading(false);
      })
      .catch((err) => {
        msgCtx.catchMessage(err);
      });
  };

  useEffect(() => {
    postListFetch();
  }, [pageNumber]);

  const deleteHandler = (id) => {
    fetch(`https://blog-app05.herokuapp.com/user/post/${id}`, {
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
    if (userData.detail.status === status) {
      msgCtx.catchMessage("Please update current status and try again");
      return;
    }
    const res = await fetch("https://blog-app05.herokuapp.com/user/status", {
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
    msgCtx.catchMessage(data.message);
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
            className="bg-teal-500 rounded-xl lg:p-[6px] p-[6px] py-[10px] font-bold lg:mx-10 mx-2 lg:text-xl text-sm lg:w-auto lg:w-42 w-4/12"
            onClick={() => {
              navigate("/postform");
            }}
          >
            NEW BLOG
          </button>
          <div className="flex justify-center items-center relative lg:w-72 w-2/3">
            <input
              className={`lg:w-full p-2 shadow appearance-none border-2 focus:outline-none focus:shadow-outline ${
                searchError ? "border-red-500" : ""
              }`}
              value={searchTerm}
              placeholder="Search a Blog"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchTouched(true);
                setSearchError(false);
              }}
            ></input>
            {searchTouched && searchTerm.length > 0 && (
              <button
                className="
                leading-4 absolute right-14"
                onClick={() => {
                  setSearchTerm("");
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
        {postsLoading ? (
          <Loading />
        ) : (
          <div className="flex justify-center h-[35rem]">
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
        )}
        {posts.length > 0 && (
          <Pagination
            numberOfPages={numberOfPages}
            setPageNumber={setPageNumber}
            currentPage={pageNumber}
          />
        )}
      </div>
    );
  }
  return (
    <div>
      <div>{content}</div>
      <Footer />
    </div>
  );
};

export default StartingPage;
