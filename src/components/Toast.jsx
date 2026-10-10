import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export const Toast = ({
  show,
  message,
  type = "success", // success, danger, warning, info
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    if (show && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getTypeConfig = () => {
    switch (type) {
      case "danger":
        return {
          bg: "bg-danger text-white",
          icon: <XCircle size={18} className="me-2 text-white" />
        };
      case "warning":
        return {
          bg: "bg-warning text-dark",
          icon: <AlertTriangle size={18} className="me-2 text-dark" />
        };
      case "info":
        return {
          bg: "bg-info text-white",
          icon: <Info size={18} className="me-2 text-white" />
        };
      default:
        return {
          bg: "bg-success text-white",
          icon: <CheckCircle2 size={18} className="me-2 text-white" />
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1090 }}
    >
      <div
        className={`toast show align-items-center ${config.bg} border-0 shadow-lg rounded-3`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex p-3">
          <div className="toast-body d-flex align-items-center fw-medium flex-grow-1 p-0">
            {config.icon}
            {message}
          </div>
          <button
            type="button"
            className="btn-close btn-close-white ms-3 m-auto"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
