import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const UserLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <div className="d-flex flex-grow-1">
        <div className="d-none d-lg-block">
          <Sidebar />
        </div>
        <main className="flex-grow-1 p-3 p-md-4 overflow-y-auto" style={{ maxWidth: "1600px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
