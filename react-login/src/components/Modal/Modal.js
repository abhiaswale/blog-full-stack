import React from "react";
import ReactDOM from "react-dom";
const Modal = (props) => {
  return ReactDOM.createPortal(
    <div className="w-full h-screen bg-black bg-opacity-60 z-20 fixed">
      <div className="absolute top-1/2 left-1/2 bg-white text-black p-4 rounded-lg">
        <section className="flex justify-between items-center font-bold text-xl">
          <h3>Some error occoured</h3>
          <button onClick={props.handleError}>X</button>
          <hr />
        </section>
        <p>{props.children}</p>
        <span>
          <button>ok</button>
          <button onClick={props.handleError}>cancel</button>
        </span>
      </div>
    </div>,
    document.getElementById("modal")
  );
};

export default Modal;
