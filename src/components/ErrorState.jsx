import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export const ErrorState = ({
  title = "Something went wrong",
  message = "An error occurred while loading this section.",
  onRetry = null
}) => {
  return (
    <div className="card border-danger-subtle bg-danger-subtle bg-opacity-25 shadow-sm rounded-4 p-4 text-center my-3">
      <div className="d-flex justify-content-center mb-2">
        <div className="p-2 rounded-circle bg-danger-subtle text-danger">
          <AlertTriangle size={32} />
        </div>
      </div>
      <h6 className="fw-semibold text-danger mb-1">{title}</h6>
      <p className="text-secondary small mb-3">{message}</p>
      {onRetry && (
        <div>
          <button onClick={onRetry} className="btn btn-outline-danger btn-sm rounded-pill px-3">
            <RefreshCw size={14} className="me-1" /> Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
