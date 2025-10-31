import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';


const ProtectedRoute = () => {
  const { token } = useAuth();

  if (!token) {
    // Not logged in so redirect to login page
    return <Navigate to="/login" />;
  }

  // Logged in, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
