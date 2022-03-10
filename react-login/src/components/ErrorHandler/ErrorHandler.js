import React, { Fragment } from "react";
import Modal from "../Modal/Modal";

const ErrorHandler = (props) => {
  //   console.log(props.error.message);
  return (
    <Fragment>
      {props.error && (
        <Modal
          title="An error occoured"
          error={props.error}
          handleError={props.onClose}
        >
          {props.error.message}
        </Modal>
      )}
    </Fragment>
  );
};

export default ErrorHandler;
