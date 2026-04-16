import { Navigate, useLocation } from 'react-router-dom';
import LoadingState from './LoadingState';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState message="Validando sesion..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/orders" replace />;
  }

  return children;
}

export default ProtectedRoute;
