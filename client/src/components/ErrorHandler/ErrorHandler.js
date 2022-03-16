import React, { Fragment } from "react";
import Modal from "../Modal/Modal";

const ErrorHandler = (props) => {
  return (
    <Fragment>
      {props.error && (
        <Modal
          title="An error occoured"
          error={props.error}
          handleError={props.onClose}
        >
          {props.error.message ? (
            <p>{props.error.message}</p>
          ) : (
            <p>{props.error}</p>
          )}
        </Modal>
      )}
    </Fragment>
  );
};

export default ErrorHandler;
