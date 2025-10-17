import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';

const PublicRoute = () => {
  const { isAuthenticated, isLoading, authCheckCompleted } = useContext(AuthContext);

  if (isLoading || !authCheckCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface dark:bg-surface-dark transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400 transition-colors duration-300"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the public route (Login)
  return <Outlet />;
};

export default PublicRoute;