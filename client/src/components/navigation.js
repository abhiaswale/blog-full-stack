import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";

const Nav = () => {
  const authCtx = useContext(AuthContext);
  const user = localStorage.getItem("userId");
  const navigate = useNavigate();
  const logoutHandler = () => {
    authCtx.logout();
    navigate("/");
  };
  return (
    <div className="flex justify-between items-center h-16 bg-teal-500">
      <h3 className="lg:text-3xl text-lg lg:mx-8 mx-4 font-bold">Blogger.</h3>
      <nav className=" lg:mx-8 mx-2 flex lg:justify-around justify-end items-center lg:w-1/6 w-1/2">
        {!authCtx.isAuth && (
          <a
            className="lg:m-2 m-2 lg:p-2 p-[4px] lg:font-medium text-sm font-normal border-2 border-b-zinc-50 rounded-md text-white hover:bg-white hover:text-black transition-all ease-in-out delay-75
            "
            href="/"
          >
            Login
          </a>
        )}
        {!authCtx.isAuth && (
          <a
            className="lg:m-2 m-2 lg:p-2 p-[4px] lg:font-medium text-sm font-normal border-2 border-b-zinc-50 rounded-md text-white hover:bg-white hover:text-black transition-all ease-in-out delay-75"
            href="/register"
          >
            Register
          </a>
        )}
        {authCtx.isAuth && (
          <a
            className="lg:m-2 m-2 lg:p-2 p-[4px] lg:font-medium text-sm font-normal border-2 border-b-zinc-50 rounded-md text-white hover:bg-white hover:text-black transition-all ease-in-out delay-75"
            href="/startpage"
          >
            Feed
          </a>
        )}
        {authCtx.isAuth && user && (
          <button
            className="lg:m-2 m-2 lg:p-2 p-[4px] lg:font-medium text-sm font-normal border-2 border-b-zinc-50 rounded-md text-white hover:bg-white hover:text-black transition-all ease-in-out delay-75"
            onClick={logoutHandler}
          >
            Logout
          </button>
        )}
      </nav>
    </div>
  );
};

export default Nav;
