import React from "react";
import ReactDOM from "react-dom";
const Modal = (props) => {
  return ReactDOM.createPortal(
    <div className="w-full h-screen bg-black bg-opacity-60 z-20 fixed">
      <div className="absolute top-1/4 left-1/4 translate-x-52 translate-y-24 bg-white text-black p-4 rounded-lg w-72">
        <section className="flex justify-between items-center font-bold text-xl w-full">
          <h3 className="">Alert!!</h3>
          {/* <button onClick={props.handleError}>X</button> */}
          <hr />
        </section>
        <section className="my-8">{props.children}</section>
        <span>
          <button
            className="text-lg px-2 mr-2 hover:bg-cyan-400 border-2 border-black"
            onClick={props.handleError}
          >
            Ok
          </button>
          <button
            className="text-lg px-2 mx-2 hover:bg-cyan-400 border-2 border-black"
            onClick={props.handleError}
          >
            Cancel
          </button>
        </span>
      </div>
    </div>,
    document.getElementById("modal")
  );
};

export default Modal;
