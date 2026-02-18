import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./AuthLayout.css";

const AuthLayout = () => {
  return (
    <div className="auth-container">
      {/* Panel Kiri */}
      <div className="left-panel">
        <div className="top-bar">
          <Navbar />
        </div>
      </div>

      {/* Panel Kanan */}
      <div className="right-panel">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
