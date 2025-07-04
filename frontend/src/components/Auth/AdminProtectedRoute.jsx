// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthToken } from '../../utils/auth';

const AdminProtectedRoute = ({ redirectPath = '/admin/login' }) => {
  const isAuthenticated = !!getAuthToken();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;