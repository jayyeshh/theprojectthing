import React from "react";

const Test = () => {
  return (
    <div style={{
        minHeight: "300vh",
        overflow: "scroll"
    }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-start",
          border: "2px dashed rgba(114, 186, 94, 0.35)",
          height: "400px",
          background: "rgba(114, 186, 94, 0.05)",
        }}
      >
        <div
          style={{
            position: "sticky",
            position: '-webkit-sticky',
            top: 0,
          }}
        >
          <h4>A</h4>
        </div>
        <div class="item shark-2">
          <h4>B</h4>
        </div>
        <div class="item shark-3">
          <h4>C</h4>
        </div>
        <div class="item shark-4">
          <h4>D</h4>
        </div>
      </div>
    </div>
  );
};

export default Test;
