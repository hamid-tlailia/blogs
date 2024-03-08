import React, { useEffect, useState } from "react";
import "../App.css";
import { NavLink, useNavigate } from "react-router-dom";
import "../js/mdb.es.min.js.map";
import axios from "axios";
const Header = () => {
  const [id, setID] = useState("");

  const navigate = useNavigate();

  // error handler

  window.onerror = () => {
    const error_modle = document.getElementById(
      "webpack-dev-server-client-overlay"
    );

    if (error_modle) {
      const iframe = error_modle.contentDocument;
      iframe.body.style.transform = "scale(0)";
      iframe.body.style.zIndex = "-1";
    }
  };

  useEffect(() => {
    const userInfos = localStorage.getItem("user");
    if (userInfos) {
      const currentInfos = JSON.parse(userInfos);
      setID(currentInfos.id);
    }
  }, [id]);

  const handleNavbar = (event) => {
    const navToggler = event.target.parentElement.parentElement.children[2];

    if (navToggler) {
      navToggler.classList.toggle("show");
    }
  };
  useEffect(() => {
    const localMode = localStorage.getItem("mode");
    const back = localStorage.getItem("background");
    if (localMode === "black") {
      document.body.style.transition = ".5s";
      document.body.style.backgroundColor = localMode;
    } else if (localMode === "transparent" && back !== "default") {
      document.body.classList = `w-100 h-100 ${back}`;
    } else {
      // document.body.style.backgroundColor = '#012a4a'
      document.body.classList = `w-100 h-100 default`;
    }
  });
  useEffect(() => {
    const brihgt = localStorage.getItem("brightness");
    document.body.style.filter = `saturate(${brihgt})`;
  });
  return (
    <div>
      <nav
        className={
          document.body.style.backgroundColor === "black" ||
          document.body.classList !== "default"
            ? "navbar navbar-expand-lg fixed bg-transparent border-bottom border-light"
            : "navbar navbar-expand-lg "
        }
      >
        <div class="container-fluid">
          <NavLink class="navbar-brand d-flex flex-row" to="/">
            <i class="fas fa-b me-3 fa-2x"></i>
            <i class="fas fa-l me-3 fa-2x text-warning"></i>
            <i class="fas fa-o me-3 fa-2x text-success"></i>
            <i class="fas fa-g text-danger fa-2x"></i>
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            onClick={handleNavbar}
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i class="fas fa-bars-staggered bars-route p-2"></i>
          </button>

          <div class="collapse navbar-collapse " id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>

            <div className="w-auto d-flex flex-row">
              <NavLink className="route btn me-2" to="/client/view">
                Client
              </NavLink>
              <NavLink className="route btn me-2" to="/dashboard">
                Admin
              </NavLink>
              <NavLink className="route btn me-3" to={`/messages/${id}`}>
                <i class="fas fa-message "></i>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
