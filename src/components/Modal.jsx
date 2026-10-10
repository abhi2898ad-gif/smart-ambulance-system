import React, { useEffect } from "react";
import { X } from "lucide-react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md", // sm, md, lg, xl
  footer = null
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getMaxWidth = () => {
    switch (size) {
      case "sm":
        return "400px";
      case "lg":
        return "800px";
      case "xl":
        return "1050px";
      default:
        return "550px";
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 1060
      }}
      onClick={onClose}
    >
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden w-100 animate-fadeIn"
        style={{ maxWidth: getMaxWidth(), maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header bg-white border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
          <h5 className="modal-title fw-bold text-dark mb-0">{title}</h5>
          <button
            type="button"
            className="btn btn-sm btn-light rounded-circle p-1 d-flex align-items-center justify-content-center"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="card-body p-4 overflow-y-auto">{children}</div>

        {footer && <div className="card-footer bg-light border-top py-3 px-4 d-flex justify-content-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
