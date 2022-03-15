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
    <div className="flex justify-between items-center h-20 bg-gray-600">
      <h3 className="text-3xl p-12 font-bold">Blogger.</h3>
      <nav>
        {!authCtx.isAuth && (
          <a className="p-10 font-semibold" href="/">
            Login
          </a>
        )}
        {!authCtx.isAuth && (
          <a className="p-10 font-semibold" href="/register">
            Register
          </a>
        )}
        {authCtx.isAuth && (
          <a className="p-10 font-semibold" href="/startpage">
            Feed
          </a>
        )}
        {user && (
          <button className="p-10 font-semibold" onClick={logoutHandler}>
            Logout
          </button>
        )}
      </nav>
    </div>
  );
};

export default Nav;
