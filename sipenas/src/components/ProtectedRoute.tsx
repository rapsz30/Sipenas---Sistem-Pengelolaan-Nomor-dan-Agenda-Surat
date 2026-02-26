import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[]; 
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "operator") {
      return <Navigate to="/operator" replace />;
    }
  }
  return <Outlet />;
};

export default ProtectedRoute;