import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/auth';

const AuthGuard = ({ children }) => {
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
