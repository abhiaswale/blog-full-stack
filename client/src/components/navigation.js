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
    <div className="flex justify-between items-center h-16 bg-gray-600">
      <h3 className="text-3xl mx-8 font-bold">Blogger.</h3>
      <nav className=" mx-8 flex justify-around items-center w-1/6">
        {!authCtx.isAuth && (
          <a
            className="p-2 font-medium border-2 border-b-zinc-50 rounded-md text-white hover:bg-white hover:text-black transition-all ease-in-out delay-75
            "
            href="/"
          >
            Login
          </a>
        )}
        {!authCtx.isAuth && (
          <a
            className="p-2 font-medium border-2 border-b-zinc-50 rounded-md text-white hover:bg-white hover:text-black transition-all ease-in-out delay-75"
            href="/register"
          >
            Register
          </a>
        )}
        {authCtx.isAuth && (
          <a
            className="p-2 font-medium border-2 border-b-zinc-50 rounded-md text-white hover:bg-white hover:text-black transition-all ease-in-out delay-75"
            href="/startpage"
          >
            Feed
          </a>
        )}
        {user && (
          <button
            className="p-2 font-medium border-2 border-b-zinc-50 rounded-md text-white hover:bg-white hover:text-black transition-all ease-in-out delay-75"
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
