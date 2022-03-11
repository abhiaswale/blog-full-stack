import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./store/auth-context";
import { MessageContextProvider } from "./store/message-context";
ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <MessageContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MessageContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
