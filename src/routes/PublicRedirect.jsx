

import { Navigate } from 'react-router-dom';
import { useSecurity } from '../hooks/useSecurity';
import { ADMIN_ROLE, USER_ROLE } from '../constants/userConstants';

const PublicRedirect = () => {
  const { validateToken, role } = useSecurity();


  if (!validateToken()) {
  return <Navigate to="/login" replace />;
  }
  if(role === ADMIN_ROLE){
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/client/events" replace />;
};

export default PublicRedirect;