import React from "react";
import { PRIORITIES } from "../utils/constants";
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

const PriorityBadge = ({ priority, showIcon = true, className = "" }) => {
  const p = priority?.toUpperCase() || "LOW";
  const config = PRIORITIES[p] || PRIORITIES.LOW;

  const renderIcon = () => {
    if (!showIcon) return null;
    const iconProps = { size: 13, className: "me-1", style: { verticalAlign: "-2px" } };
    switch (p) {
      case "CRITICAL":
        return <AlertCircle {...iconProps} />;
      case "HIGH":
        return <AlertTriangle {...iconProps} />;
      case "MEDIUM":
        return <Info {...iconProps} />;
      default:
        return <CheckCircle2 {...iconProps} />;
    }
  };

  return (
    <span
      className={`badge rounded-pill fw-semibold px-2 py-1 ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`
      }}
    >
      {renderIcon()}
      {config.label}
    </span>
  );
};

export default PriorityBadge;
