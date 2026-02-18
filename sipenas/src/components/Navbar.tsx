import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const isLoginGroup =
    location.pathname === "/" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/forgot-username";

  const isPrivacy = location.pathname === "/privacy";
  const isHelp = location.pathname === "/help";

  return (
    <nav className="shared-nav">
      <Link
        to="/help"
        className={isHelp ? "nav-item-active" : "nav-item"}
      >
        Bantuan
      </Link>

      <Link to="/" className={isLoginGroup ? "nav-item-active" : "nav-item"}>
        Login
      </Link>

      <Link
        to="/privacy"
        className={isPrivacy ? "nav-item-active" : "nav-item"}
      >
        Privasi
      </Link>
    </nav>
  );
};

export default Navbar;
