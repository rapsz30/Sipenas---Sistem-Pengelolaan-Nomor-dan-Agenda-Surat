import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faFileCirclePlus,
  faRightFromBracket,
  faUser,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/operator", icon: faChartPie },
    { name: "Ajukan Surat", path: "/ajukan-surat", icon: faFileCirclePlus },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/"); 
  };

  return (
    <>
      <button className="hamburger-btn" onClick={() => setOpen(!open)}>
        <FontAwesomeIcon icon={open ? faXmark : faBars} />
      </button>

      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-box">S</div>
          SIPENAS
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`sidebar-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={item.icon} />
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="sidebar-link logout-link"
            style={{ 
              background: "none", 
              border: "none", 
              width: "100%", 
              textAlign: "left", 
              cursor: "pointer",
              fontFamily: "inherit" 
            }}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Keluar
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-box">
            <div className="user-avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="user-info">
              <strong>Nama User</strong>
              <span>Jabatan</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;