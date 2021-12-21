import React from "react";

import Modal from "./Modal";
import "../../components/FormElements/Button.css";
import "./ErrorModal.css";

const ErrorModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={
        <button className="btn" onClick={props.onClear}>
          Okay
        </button>
      }
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
