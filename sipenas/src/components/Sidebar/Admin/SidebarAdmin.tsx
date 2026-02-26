import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faEnvelopeOpenText,
  faCalendarDays,
  faRightFromBracket,
  faUser,
  faBars,
  faXmark, 
} from "@fortawesome/free-solid-svg-icons";

const SidebarAdmin = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // 1. Tambahkan useNavigate

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: faChartPie },
    { name: "Kelola Surat", path: "/kelola-surat", icon: faEnvelopeOpenText },
    { name: "Atur Periode", path: "/atur-periode", icon: faCalendarDays },
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
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarAdmin;