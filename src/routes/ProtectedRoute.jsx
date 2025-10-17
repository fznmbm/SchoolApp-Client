import { useContext } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, authCheckCompleted } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading || !authCheckCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface dark:bg-surface-dark transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400 transition-colors duration-300"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;