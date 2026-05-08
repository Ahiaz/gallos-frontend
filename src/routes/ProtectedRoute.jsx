import { Navigate, Outlet } from 'react-router-dom';
import { useSecurity } from '../hooks/useSecurity';

const ProtectedRoute = () => {
  const { validateToken } = useSecurity();

  return validateToken()
    ? <Outlet />
    : <Navigate to="/login" replace />;
};

export default ProtectedRoute;