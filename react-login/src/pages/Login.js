import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";

const Login = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const loginHandler = async (e) => {
    console.log(authCtx.isAuth);
    e.preventDefault();
    if (!email && !password) {
      alert("email & password cannot be empty");
      return;
    }
    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => {
        if (res.statusCode === 422) {
          throw new Error("Validation Failed");
        }
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Could not authenticate you");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        authCtx.login(data.token);
        authCtx.userIdHandler(data.userId);
        setIsAuth(true);
        navigate("/startpage");
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };

  const newUserHandler = () => {
    navigate("/register");
  };

  let routes;

  if (isAuth) {
    // routes = <StartingPage userId={userId} token={token} />;
  } else {
    routes = (
      <div>
        <h1>Login</h1>
        <form onSubmit={loginHandler}>
          <input
            value={email}
            type="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <input
            value={password}
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <button type="submit">Submit</button>
        </form>
        <button onClick={newUserHandler}>New user</button>
      </div>
    );
  }
  return <div>{routes}</div>;
};

export default Login;
