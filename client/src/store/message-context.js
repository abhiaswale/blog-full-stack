import React, { useState } from "react";

const MessageContext = React.createContext({
  message: null,
  catchMessage: (msg) => {},
  clearMessage: () => {},
});

export const MessageContextProvider = (props) => {
  const [msg, setMsg] = useState(null);
  const setMessage = (message) => {
    setMsg(message);
  };

  const deleteMessage = () => {
    setMessage(null);
  };

  const msgContextValue = {
    message: msg,
    catchMessage: setMessage,
    clearMessage: deleteMessage,
  };

  return (
    <MessageContext.Provider value={msgContextValue}>
      {props.children}
    </MessageContext.Provider>
  );
};
export default MessageContext;
