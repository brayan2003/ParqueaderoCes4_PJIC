/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
import styles from "./Modal.module.css";

const Modal = ({ type, message, onAccept }) => {
  return (
    <div
      className={`${styles.modal} ${
        type === "error" ? styles.error : styles.correct
      }`}
    >
      <div className={styles.content}>
        <p>{message}</p>
        <button onClick={onAccept}>Aceptar</button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  type: PropTypes.oneOf(["correct", "error"]).isRequired,
  message: PropTypes.string.isRequired,
  onAccept: PropTypes.func.isRequired,
};

export default Modal;
