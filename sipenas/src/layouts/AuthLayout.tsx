import { Outlet, Link, useLocation } from "react-router-dom";
import "./AuthLayout.css"; 

const AuthLayout = () => {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    return location.pathname === path ? "nav-btn-active" : "nav-link";
  };

  return (
    <div className="auth-container">
      {/* Panel Kiri */}
      <div className="left-panel">
        <nav className="top-nav">
          <Link to="#" className="nav-link">Bantuan</Link>
          <Link to="/" className={getLinkClass("/")}>Login</Link>
          <Link to="/privacy" className={getLinkClass("/privacy")}>Privasi</Link>
        </nav>
      </div>

      {/* Panel Kanan */}
      <div className="right-panel">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;