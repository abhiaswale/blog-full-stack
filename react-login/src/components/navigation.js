import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";

const Nav = () => {
  const authCtx = useContext(AuthContext);
  const user = localStorage.getItem("userId");
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };
  return (
    <div>
      <nav>
        {!authCtx.isAuth && <a href="/">Login</a>}
        {!authCtx.isAuth && <a href="/register">Register</a>}
        {user && <button onClick={logoutHandler}>Logout</button>}
      </nav>
    </div>
  );
};

export default Nav;
