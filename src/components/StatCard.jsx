import React from "react";

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "primary", // primary, success, danger, warning, info
  trend = null, // { value: "+12%", isPositive: true }
  className = ""
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconBg: "bg-danger-subtle text-danger",
          borderHover: "border-danger"
        };
      case "warning":
        return {
          iconBg: "bg-warning-subtle text-warning",
          borderHover: "border-warning"
        };
      case "success":
        return {
          iconBg: "bg-success-subtle text-success",
          borderHover: "border-success"
        };
      case "info":
        return {
          iconBg: "bg-info-subtle text-info",
          borderHover: "border-info"
        };
      default:
        return {
          iconBg: "bg-primary-subtle text-primary",
          borderHover: "border-primary"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`card shadow-sm border-0 rounded-4 p-3 h-100 transition-all ${className}`}>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="text-secondary small fw-medium text-uppercase letter-spacing-wide">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-3 ${styles.iconBg} d-flex align-items-center justify-content-center`}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="d-flex align-items-baseline gap-2 mb-1">
        <h3 className="h2 fw-bold text-dark mb-0">{value}</h3>
        {trend && (
          <span className={`badge rounded-pill ${trend.isPositive ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"} small`}>
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
