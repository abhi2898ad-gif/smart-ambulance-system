import React from "react";

export const Loading = ({ message = "Loading data...", fullPage = false }) => {
  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center p-5 text-center">
      <div className="spinner-border text-primary mb-3" style={{ width: "2.8rem", height: "2.8rem" }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-secondary fw-medium mb-0">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
