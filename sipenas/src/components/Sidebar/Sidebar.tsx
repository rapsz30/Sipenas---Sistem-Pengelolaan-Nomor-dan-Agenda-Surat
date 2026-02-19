import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faFileCirclePlus,
  faRightFromBracket,
  faUser
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/operator", icon: faChartPie },
    { name: "Ajukan Surat", path: "/ajukan-surat", icon: faFileCirclePlus },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-box">S</div>
        SIPENAS
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <FontAwesomeIcon icon={item.icon} />
            {item.name}
          </Link>
        ))}
        <Link to="/" className="sidebar-link logout-link">
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
            <strong>Nama User</strong>
            <span>Jabatan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
