import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Loading from "../components/Loading/Loading";
import AuthContext from "../store/auth-context";
import { TestCredentials } from "../test";

const Login = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const location = useLocation();
  const registerMsg = location.state;

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Email cannot be empty");
      return;
    }
    if (!password) {
      setErrorMsg("Password cannot be empty");
      return;
    }
    if (password.length < 5) {
      setErrorMsg("Password must be atleast 5 characters Long");
      return;
    }
    setLoading(true);
    fetch("https://blog-app05.herokuapp.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Invalid credentials");
        }
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Could not authenticate you");
        }
        return res.json();
      })
      .then((data) => {
        authCtx.login(data.token);
        authCtx.userIdHandler(data.userId);
        const remainingMiliseconds = 60 * 60 * 1000;
        const expiryDate = new Date().getTime() + remainingMiliseconds;
        localStorage.setItem("expiryDate", expiryDate);
        autoLogoutHandler(remainingMiliseconds);
        setIsAuth(true);
        setLoading(false);
      })
      .then(() => {
        navigate("/startpage");
      })
      .catch((err) => {
        setIsAuth(false);
        setErrorMsg(err.message);
      });
  };

  const autoLogoutHandler = (miliseconds) => {
    setTimeout(() => {
      authCtx.logout();
    }, miliseconds);
  };

  const setTestCredentials = () => {
    setEmail(TestCredentials.email);
    setPassword(TestCredentials.password);
  };

  let content;

  if (isAuth) {
    // navigate("/startpage");
  } else {
    content = (
      <div className="lg:w-1/3 flex justify-center items-center shadow-2xl flex-col bg-white p-8 my-28">
        <h1 className="text-2xl font-semibold p-2">Welcome Back</h1>
        {registerMsg && (
          <p className="border-[2px] border-[#00eb8d] bg-[#00eb8d] bg-opacity-50 shadow-inner rounded-lg p-[4px]">
            {registerMsg}
          </p>
        )}
        <p className="p-2 text-center">
          Enter your credentials to access your account
        </p>
        <form className="w-full" onSubmit={loginHandler}>
          <div className="focus-within:text-green-600 focus:outline-none">
            <input
              value={email}
              type="email"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg(null);
              }}
              className={` w-full my-2 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errorMsg && errorMsg.toLowerCase().includes("email")
                  ? "border-red-600"
                  : ""
              } `}
            ></input>
          </div>
          <div>
            <input
              value={password}
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg(null);
              }}
              className={` w-full my-2 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errorMsg && errorMsg.toLowerCase().includes("password")
                  ? "border-red-500"
                  : ""
              } `}
            ></input>
          </div>
          <p className=" text-red-400 font-semibold text-center">{errorMsg}</p>
          <div className="flex justify-center items-center flex-col my-2 w-full">
            <button
              className="font-semibold p-3 bg-cyan-300 rounded-lg hover:bg-purple-400 transition-all ease-in-out delay-100"
              type="submit"
            >
              Login
            </button>
            <button className="mt-2" type="submit" onClick={setTestCredentials}>
              Login with test credentials
            </button>
            <p className="my-2">
              New user?{" "}
              <a href="/register" className="text-blue-600">
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
    );
  }
  return (
    <div>
      {!loading && (
        <section className="flex justify-center items-center">
          {content}
        </section>
      )}
      {loading && <Loading />}
      <Footer />
    </div>
  );
};

export default Login;
