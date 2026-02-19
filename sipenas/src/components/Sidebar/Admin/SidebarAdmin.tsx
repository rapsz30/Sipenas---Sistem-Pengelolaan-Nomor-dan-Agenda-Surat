import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "../Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faEnvelopeOpenText,
  faGear,
  faRightFromBracket,
  faUser,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const SidebarAdmin = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: faChartPie },
    { name: "Kelola Surat", path: "/kelola-surat", icon: faEnvelopeOpenText },
    { name: "Pengaturan", path: "/pengaturan", icon: faGear },
  ];

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

          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="sidebar-link logout-link"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Keluar
          </Link>
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
