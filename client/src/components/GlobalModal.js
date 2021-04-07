import React from "react";
import "../styles/animations.css";

const GlobalModal = ({ modalText, ...props }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "1rem",
        left: "28%",
        zIndex: "9999",
        background: "white",
        padding: "2rem",
        boxShadow: "5px 5px 14px",
        borderRadius: "3px",
        textAlign: "center",
        width: "40%",
        transition: "all .4s ease-in-out",
        opacity: ".8",
        animation: "fromTop .2s ease-in-out",
      }}
    >
      {modalText}
    </div>
  );
};

export default GlobalModal;
