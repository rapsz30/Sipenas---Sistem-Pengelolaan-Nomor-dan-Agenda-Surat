import { Link, useLocation } from "react-router-dom";
import "./Navbar.css"; 

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? "nav-item-active" : "nav-item";

  return (
    <nav className="shared-nav">
      <Link to="#" className="nav-item">Bantuan</Link>
      <Link to="/" className={isActive("/")}>Login</Link>
      <Link to="/privacy" className={isActive("/privacy")}>Privasi</Link>
    </nav>
  );
};

export default Navbar;