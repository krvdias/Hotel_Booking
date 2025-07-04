// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthToken } from '../../utils/auth';

const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const isAuthenticated = !!getAuthToken();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;