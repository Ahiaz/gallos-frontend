import { Navigate, Outlet } from "react-router-dom";
import { useSecurity } from "../hooks/useSecurity";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { role } = useSecurity();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;