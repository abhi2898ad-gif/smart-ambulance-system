import React from "react";
import { getStatusBadgeProps } from "../utils/helpers";

const StatusBadge = ({ status, className = "" }) => {
  if (!status) return null;
  const config = getStatusBadgeProps(status);

  return (
    <span className={`badge rounded-pill fw-medium px-2 py-1 ${config.bg} ${config.text} border ${config.border} ${className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
