import React from "react";
import ReactDOM from "react-dom";
const Modal = (props) => {
  return ReactDOM.createPortal(
    <div className="font-Mon w-full h-screen bg-black bg-opacity-60 z-20 fixed">
      <div className="absolute top-1/4 left-1/4 lg:translate-x-52 translate-x-[-41px] translate-y-24 bg-white text-black p-4 rounded-lg w-72">
        <section className="flex justify-between items-center font-bold text-xl w-full">
          <h3 className="">Alert!!</h3>
          {/* <button onClick={props.handleError}>X</button> */}
          <hr />
        </section>
        <section className="my-4">{props.children}</section>
        <span>
          <button
            className="text-lg px-2 mr-2 hover:bg-sky-500 hover:text-white transition-all ease-in-out delay-75 border-2 rounded-lg border-black"
            onClick={props.handleError}
          >
            Ok
          </button>
          <button
            className="text-lg px-2 mx-2 hover:bg-sky-500 hover:text-white transition-all ease-in-out delay-75 border-2  rounded-lg border-black"
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
