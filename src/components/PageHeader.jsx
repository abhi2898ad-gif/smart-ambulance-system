import React from "react";

const PageHeader = ({ title, subtitle, action, badge, children }) => {
  return (
    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between pb-3 mb-4 border-bottom">
      <div>
        <div className="d-flex align-items-center gap-2 mb-1">
          <h1 className="h3 fw-bold text-dark mb-0">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
      </div>
      {(action || children) && (
        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
          {action}
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
