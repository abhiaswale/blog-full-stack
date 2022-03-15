import React, { useState } from "react";

const AuthContext = React.createContext({
  token: null,
  userId: null,
  isAuth: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const initialUserId = localStorage.getItem("userId");
  const [userId, setUserId] = useState(initialUserId);
  const isLoggedIn = !!token;

  const userHandler = (userId) => {
    setUserId(userId);
    localStorage.setItem("userId", userId);
  };

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };
  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiryDate");
  };

  const contextValue = {
    token: token,
    userId: userId,
    userIdHandler: userHandler,
    isAuth: isLoggedIn,
    logout: logoutHandler,
    login: loginHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
