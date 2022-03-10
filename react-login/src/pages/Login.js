import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal/Modal";
import AuthContext from "../store/auth-context";

const Login = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Email cannot be empty");
      return;
    }
    if (!password) {
      alert("password cannot be empty");
      return;
    }
    if (password.length < 5) {
      alert("password must be 5 charaters long");
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
        if (res.status === 401) {
          throw new Error("Please Enter Valid Email");
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
      })
      .then(() => {
        navigate("/startpage");
      })
      .catch((err) => {
        console.log(err);
        setIsAuth(false);
        alert(err);
      });
  };

  // const newUserHandler = () => {
  //   navigate("/register");
  // };

  let routes;

  if (isAuth) {
    // routes = <StartingPage userId={userId} token={token} />;
  } else {
    routes = (
      <div className="flex justify-center items-center flex-col absolute top-52 left-1/3 bg-white p-10 rounded-2xl">
        <h1 className="text-2xl font-semibold p-4">Welcome Back</h1>
        <p className="p-2">Enter your credentials to access your account</p>
        <form onSubmit={loginHandler}>
          <div>
            <input
              value={email}
              type="email"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-96 my-2 text-white bg-black text-lg p-2 rounded-xl"
            ></input>
          </div>
          <div>
            <input
              value={password}
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-96 my-2 text-white bg-black text-lg p-2 rounded-xl"
            ></input>
          </div>
          <div className="flex justify-center items-center my-2 w-full">
            <button
              className="font-semibold p-3 bg-blue-600 rounded-lg"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
        {/* <button onClick={newUserHandler}>New user</button> */}
      </div>
    );
  }
  return (
    <div>
      {/* {openModal && <Modal onCancel={setOpenModal} />}
      <button
        onClick={() => {
          setOpenModal(!openModal);
        }}
      >
        open
      </button> */}
      {routes}
    </div>
  );
};

export default Login;
