import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";

const Nav = () => {
  const authCtx = useContext(AuthContext);
  const user = localStorage.getItem("userId");
  const navigate = useNavigate();
  const logoutHandler = () => {
    // localStorage.removeItem("token");
    // localStorage.removeItem("userId");
    authCtx.logout();
    navigate("/");
  };
  return (
    <div className="flex justify-between items-center h-20 bg-gray-600">
      <h3 className="text-3xl p-12 font-bold">Blogger.</h3>
      <nav>
        {!authCtx.isAuth && (
          <a className="p-10" href="/">
            Login
          </a>
        )}
        {!authCtx.isAuth && (
          <a className="p-10" href="/register">
            Register
          </a>
        )}
        {user && <button onClick={logoutHandler}>Logout</button>}
      </nav>
    </div>
  );
};

export default Nav;
