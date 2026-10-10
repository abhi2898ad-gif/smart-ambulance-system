import React from "react";
import { Inbox } from "lucide-react";

export const EmptyState = ({
  icon: Icon = Inbox,
  title = "No records found",
  description = "There are no items to display at this moment.",
  action = null
}) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-3">
      <div className="d-flex justify-content-center mb-3">
        <div className="p-3 rounded-circle bg-light text-secondary">
          <Icon size={38} />
        </div>
      </div>
      <h5 className="fw-semibold text-dark mb-1">{title}</h5>
      <p className="text-muted small mb-3 mx-auto" style={{ maxWidth: "400px" }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
