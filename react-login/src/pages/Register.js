import { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submitHandler = async (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error("Email already exists!");
        }
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating a user failed");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        alert(err);
      });
  };
  return (
    <div className="flex justify-center items-center flex-col absolute top-52 left-1/3 bg-white p-10 rounded-2xl">
      <h1 className="text-2xl font-semibold p-4">Register</h1>
      <form onSubmit={submitHandler}>
        <div>
          <input
            value={name}
            type="text"
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="w-96 my-2 bg-black text-lg p-2 rounded-xl"
          ></input>
        </div>
        <div>
          <input
            value={email}
            type="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="w-96 my-2 bg-black text-lg p-2 rounded-xl"
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
            className="w-96 my-2 bg-black text-lg p-2 rounded-xl"
          />
        </div>
      </form>
      <div className="flex justify-center items-center my-2 w-full">
        <button
          className="font-semibold p-3 bg-blue-600 rounded-lg"
          type="submit"
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;
