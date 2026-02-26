import { Navigate, Outlet } from "react-router-dom";
import "./AuthLayout.css"; 
import Navbar from "../components/Navbar/Navbar";

const AuthLayout = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "operator") {
      return <Navigate to="/operator" replace />;
    }
  }

  return (
    <div className="auth-container">
      <div className="left-panel">
        <div className="top-bar">
          <Navbar />
        </div>
      </div>
      <div className="right-panel">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
