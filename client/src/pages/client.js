import React, { useEffect, useState } from "react";
import "../App.css";
import { NavLink, Outlet } from "react-router-dom";

const Client = () => {
  const [mode, setMode] = useState("");
  useEffect(() => {
    const localMode = localStorage.getItem("mode");
    setMode(localMode);
  });
  return (
    <div
      className={
        mode === "black"
          ? "card m-3 p-0 mt-3 bg-transparent"
          : "card bg-transparent m-3 p-0 mt-3 me-3"
      }
    >
      <div className="card-header">
        <h3 className="card-title text-center text-decoration-underline">
          Welcome , Let's start publish your first Blog!
        </h3>
      </div>
      <div className="card-body p-0 d-flex flex-column">
        <div className="header-btns w-100 shadow-1 d-flex flex-row justify-content-center">
          <NavLink
            className="btn btn-outline-primary rounded-0 me-3"
            to="create"
          >
            Create Blog
          </NavLink>
          <NavLink className="btn btn-outline-warning rounded-0" to="view">
            View Blogs
          </NavLink>
        </div>

        <div className="btns-result">
          <Outlet />
        </div>
      </div>
      <div className="card-footer"></div>
    </div>
  );
};

export default Client;
